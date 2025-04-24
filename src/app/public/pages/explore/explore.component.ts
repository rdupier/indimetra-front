import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { FiltroSelectComponent } from '../../../shared/components/filtro-select/filtro-select.component';
import { CategoryService } from '../../../core/services/category.service';
import { CortometrajeService } from '../../../core/services/cortometraje.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltroSelectComponent],
  templateUrl: './explore.component.html',
})
export class ExploreComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private cortometrajeService = inject(CortometrajeService);

  // Signals para filtros y datos
  cortometrajes = signal<Cortometraje[]>([]);
  filtroGenero = signal<string | null>(null);
  filtroIdioma = signal<string | null>(null);
  filtroDuracion = signal<string | null>(null);

  // Opciones dinámicas
  generos = signal<string[]>([]);
  idiomas = signal<string[]>([]);
  duraciones: string[] = ['< 5 min', '5-10 min', '10-20 min', '> 20 min'];

  cortometrajesFiltrados = computed(() => {
    return this.cortometrajes().filter((c) => {
      return (
        (!this.filtroGenero() || c.category === this.filtroGenero()) &&
        (!this.filtroIdioma() || c.language === this.filtroIdioma()) &&
        (!this.filtroDuracion() || this.comprobarDuracion(c.duration))
      );
    });
  });

  ngOnInit(): void {
    this.loadCategorias();
    this.loadIdiomas();
    this.loadCortometrajes();
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
    this.cortometrajeService.getAllCortometrajesPaginados(0, 100).subscribe({
      next: (res) => this.cortometrajes.set(res.data),
      error: (err) => console.error('Error cargando cortometrajes', err),
    });
  }

  aplicarFiltros() {
    // Aquí podrías realizar la llamada al backend si decides filtrar allí
  }

  resetFiltros() {
    this.filtroGenero.set(null);
    this.filtroIdioma.set(null);
    this.filtroDuracion.set(null);
  }

  comprobarDuracion(duracion: number): boolean {
    switch (this.filtroDuracion()) {
      case '< 5 min':
        return duracion < 5;
      case '5-10 min':
        return duracion >= 5 && duracion <= 10;
      case '10-20 min':
        return duracion > 10 && duracion <= 20;
      case '> 20 min':
        return duracion > 20;
      default:
        return true;
    }
  }
}
