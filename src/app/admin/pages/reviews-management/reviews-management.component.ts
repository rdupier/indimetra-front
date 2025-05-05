import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/interfaces/review.interface';
import { FiltroSelectComponent } from '../../../shared/components/filtro-select/filtro-select.component';
import Swal from 'sweetalert2';
import { NgIf, NgFor } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reviews-management',
  standalone: true,
  imports: [FiltroSelectComponent, NgIf, NgFor],
  templateUrl: './reviews-management.component.html',
})
export class ReviewsManagementComponent implements OnInit {
  private reviewService = inject(ReviewService);

  // Datos originales y filtrados
  reviews = signal<Review[]>([]);
  reviewsFiltradas = signal<Review[]>([]);

  // Filtros
  peliculas = signal<string[]>([]);
  usuarios = signal<string[]>([]);
  filtroPelicula = signal<string | null>(null);
  filtroUsuario = signal<string | null>(null);

  // Paginación
  paginaActual = signal(0);
  tamanoPagina = signal(10);
  totalPaginas = signal(0);

  // Selección
  seleccionadas = signal<Set<number>>(new Set());

  constructor() {
    effect(() => {
      this.aplicarFiltros();
    });
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getAllReviews().subscribe({
      next: (res) => {
        this.reviews.set(res);

        // Filtros dinámicos
        const usuarios = [...new Set(res.map((r) => r.username))];
        const peliculas = [...new Set(res.map((r) => r.cortometrajeTitle))];
        this.usuarios.set(usuarios);
        this.peliculas.set(peliculas);

        this.aplicarFiltros();
      },
      error: (err) => console.error('Error cargando reseñas', err),
    });
  }

  aplicarFiltros() {
    let filtradas = this.reviews();
    const usuario = this.filtroUsuario();
    const pelicula = this.filtroPelicula();

    if (usuario) {
      filtradas = filtradas.filter((r) => r.username === usuario);
    }

    if (pelicula) {
      filtradas = filtradas.filter((r) => r.cortometrajeTitle === pelicula);
    }

    this.reviewsFiltradas.set(filtradas);
    const total = Math.ceil(filtradas.length / this.tamanoPagina());
    this.totalPaginas.set(total);
    this.paginaActual.set(0);
  }

  resetFiltros() {
    this.filtroPelicula.set(null);
    this.filtroUsuario.set(null);
    this.paginaActual.set(0);
    this.seleccionadas.set(new Set());
    this.aplicarFiltros();
  }

  // Paginación local
  get reviewsPaginadas() {
    const start = this.paginaActual() * this.tamanoPagina();
    const end = start + this.tamanoPagina();
    return this.reviewsFiltradas().slice(start, end);
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

  onSeleccionarReview(id: number) {
    this.seleccionadas.update((set) => {
      const copia = new Set(set);
      copia.has(id) ? copia.delete(id) : copia.add(id);
      return copia;
    });
  }

  eliminarSeleccionadas() {
    const ids = Array.from(this.seleccionadas());

    if (ids.length === 0) return;

    Swal.fire({
      icon: 'question',
      title: '¿Eliminar reseñas seleccionadas?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A9A59B',
      cancelButtonColor: '#555',
      background: '#2A2929',
      color: '#FFF8F8',
    }).then((result) => {
      if (result.isConfirmed) {
        const peticiones = ids.map((id) => this.reviewService.deleteReview(id));
        forkJoin(peticiones).subscribe({
          next: () => {
            this.reviews.update((lista) =>
              lista.filter((r) => !ids.includes(r.id))
            );
            this.aplicarFiltros();
            this.seleccionadas.set(new Set());

            Swal.fire({
              icon: 'success',
              title: 'Reseñas eliminadas',
              text: 'Las reseñas se eliminaron correctamente.',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar. Intenta nuevamente.',
              confirmButtonText: 'Cerrar',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
          },
        });
      }
    });
  }
}
