import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/interfaces/review.interface';
import { FiltroSelectComponent } from '../../../shared/components/filtro-select/filtro-select.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reviews-management',
  standalone: true,
  imports: [FiltroSelectComponent],
  templateUrl: './reviews-management.component.html',
})
export class ReviewsManagementComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private route = inject(ActivatedRoute);

  reviews = signal<Review[]>([]);
  reviewsFiltradas = signal<Review[]>([]);

  peliculas = signal<string[]>([]);
  usuarios = signal<string[]>([]);
  filtroPelicula = signal<string | null>(null);
  filtroUsuario = signal<string | null>(null);

  paginaActual = signal(0);
  tamanoPagina = signal(10);
  totalPaginas = signal(0);

  constructor() {
    effect(() => {
      this.aplicarFiltros();
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const peliculaParam = params['pelicula'];
      if (peliculaParam) {
        this.filtroPelicula.set(peliculaParam);
      }
    });

    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getAllReviews().subscribe({
      next: (res) => {
        this.reviews.set(res);

        const usuarios = [...new Set(res.map((r) => r.username))];
        const peliculas = [...new Set(res.map((r) => r.cortometrajeTitle))];

        this.usuarios.set(usuarios);
        this.peliculas.set(peliculas);

        this.aplicarFiltros();
      },
      error: (err) => console.error('Error cargando reseñas', err),
    });
  }

  aplicarFiltros(): void {
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

  resetFiltros(): void {
    this.filtroPelicula.set(null);
    this.filtroUsuario.set(null);
    this.paginaActual.set(0);
    this.aplicarFiltros();
  }

  get reviewsPaginadas(): Review[] {
    const start = this.paginaActual() * this.tamanoPagina();
    const end = start + this.tamanoPagina();
    return this.reviewsFiltradas().slice(start, end);
  }

  siguientePagina(): void {
    if (this.paginaActual() < this.totalPaginas() - 1) {
      this.paginaActual.update((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 0) {
      this.paginaActual.update((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  eliminarReview(id: number): void {
    Swal.fire({
      icon: 'question',
      title: '¿Eliminar esta reseña?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A9A59B',
      cancelButtonColor: '#555',
      background: '#2A2929',
      color: '#FFF8F8',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.deleteReview(id).subscribe({
          next: () => {
            this.reviews.update((lista) => lista.filter((r) => r.id !== id));
            this.aplicarFiltros();

            Swal.fire({
              icon: 'success',
              title: 'Reseña eliminada',
              text: 'La reseña ha sido eliminada correctamente.',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la reseña.',
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
