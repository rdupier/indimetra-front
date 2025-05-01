import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { FiltroSelectComponent } from '../../../shared/components/filtro-select/filtro-select.component';
import { CategoryService } from '../../../core/services/category.service';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { CortometrajeCardComponent } from '../../../shared/components/cortometraje-card/cortometraje-card.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FiltroSelectComponent,
    CortometrajeCardComponent,
  ],
  templateUrl: './explore.component.html',
})
export class ExploreComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private cortometrajeService = inject(CortometrajeService);

  cortometrajes = signal<Cortometraje[]>([]);
  filtroGenero = signal<string | null>(null);
  filtroIdioma = signal<string | null>(null);
  filtroDuracion = signal<string | null>(null);

  paginaActual = signal(0);
  tamanoPagina = signal(12);
  totalPaginas = signal(0);

  generos = signal<string[]>([]);
  idiomas = signal<string[]>([]);
  duraciones: string[] = ['< 5 min', '5-10 min', '10-20 min', '> 20 min'];

  constructor() {
    effect(() => {
      this.filtroGenero();
      this.filtroIdioma();
      this.filtroDuracion();
      this.paginaActual.set(0);
    });

    effect(() => {
      this.filtroGenero();
      this.filtroIdioma();
      this.filtroDuracion();
      this.paginaActual();
      this.loadCortometrajes();
    });
  }

  ngOnInit(): void {
    this.loadCategorias();
    this.loadIdiomas();
  }

  loadCategorias() {
    this.categoryService.getAllCategories().subscribe({
      next: (categorias) => {
        const nombres = categorias.map((c) => c.name);
        this.generos.set(nombres);
      },
      error: (err) => console.error('Error cargando categorías', err),
    });
  }

  loadIdiomas() {
    this.cortometrajeService.getAllLanguages().subscribe({
      next: (res) => this.idiomas.set(res),
      error: (err) => console.error('Error cargando idiomas', err),
    });
  }

  loadCortometrajes() {
    const page = this.paginaActual();
    const size = this.tamanoPagina();
    const genero = this.filtroGenero();
    const idioma = this.filtroIdioma();
    const duracion = this.mapDuracionValor(this.filtroDuracion());

    this.cortometrajeService
      .buscarConFiltros(genero, idioma, duracion, page, size)
      .subscribe({
        next: (res) => {
          this.cortometrajes.set(res.data);
          const totalPaginasCalculadas = Math.ceil(
            res.totalItems / res.pageSize
          );
          this.totalPaginas.set(totalPaginasCalculadas);
        },
        error: (err) => console.error('Error al filtrar cortometrajes', err),
      });
  }

  resetFiltros() {
    this.filtroGenero.set(null);
    this.filtroIdioma.set(null);
    this.filtroDuracion.set(null);
    this.paginaActual.set(0);
  }

  siguientePagina() {
    if (this.paginaActual() < this.totalPaginas() - 1) {
      this.paginaActual.update((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  paginaAnterior() {
    if (this.paginaActual() > 0) {
      this.paginaActual.update((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private mapDuracionValor(valor: string | null): string | null {
    switch (valor) {
      case '< 5 min':
      case '5-10 min':
      case '10-20 min':
      case '> 20 min':
        return valor;
      default:
        return null;
    }
  }
}
