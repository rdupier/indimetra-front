import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalService } from '../../../shared/modal.service';

import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { ReviewService } from '../../../core/services/review.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { Review } from '../../../core/interfaces/review.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { ValorarModalComponent } from '../../../shared/components/valorar-modal/valorar-modal.component';

@Component({
  selector: 'app-cortometraje-detail',
  standalone: true,
  templateUrl: './cortometraje-detail.component.html',
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule, ValorarModalComponent],
})
export class CortometrajeDetailComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private location: Location
  ) {}

  private route = inject(ActivatedRoute);
  private cortometrajeService = inject(CortometrajeService);
  private reviewService = inject(ReviewService);
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);

  cortometraje = signal<Cortometraje | null>(null);
  reviews = signal<Review[]>([]);
  mostrarResenas = signal(false);
  modalResenas = signal(false);
  estaEnWatchLater = signal(false);
  favoriteId: number | null = null;

  isLoggedIn = computed(() => this.authService.isLoggedIn());

  formValoracion!: FormGroup;
  formTocado = false;
  errorMessage!: string;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) return;

    this.cortometrajeService.getCortometrajeById(id).subscribe({
      next: (data: any) => {
        this.cortometraje.set(data.data);
        this.checkIfFavorite(data.data.id);
      },
      error: (err) => console.error('Error cargando cortometraje', err),
    });

    this.reviewService.getReviewsByCortometrajeId(id).subscribe({
      next: (res) => {
        this.reviews.set(res);
      },
      error: (err) => console.error('Error al cargar reseñas', err),
    });

    this.formValoracion = this.fb.group({
      rating: [0, [Validators.min(1)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
    });

  }

  abrirModalLogin() {
    this.modalService.showLoginModal.set(true);
  }

  toggleReviews(): void {
    this.mostrarResenas.update((v) => !v);
  }

  abrirValoracion(): void {
    this.modalResenas.set(true);
  }

  cerrarValoracion(): void {
    this.modalResenas.set(false);
  }

  seleccionarEstrella(valor: number): void {
    this.formValoracion.get('rating')?.setValue(valor);
  }

  enviarValoracionExterna(data: { rating: number; comment: string }) {
    if (!data || typeof data.rating !== 'number') return;

    const cortometrajeId = this.cortometraje()?.id;
    if (!cortometrajeId) return;

    const body = {
      cortometrajeId,
      rating: parseFloat(data.rating.toFixed(1)),
      comment: data.comment.trim(),
    };

    this.reviewService.createReview(body).subscribe({
      next: (nuevaResena) => {
        this.reviews.update(actuales => [...actuales, nuevaResena]);
        this.modalResenas.set(false);
      },
      error: (err) => {
        console.error('Error al enviar valoración', err);
        this.errorMessage = err.error.message;
      },
    });
  }

  toggleWatchLater(): void {
    const cortoId = this.cortometraje()?.id;
    if (!cortoId) return;

    if (this.estaEnWatchLater()) {
      this.cortometrajeService.removeFromFavorites(this.favoriteId!).subscribe({
        next: () => {
          this.estaEnWatchLater.set(false);
          this.favoriteId = null;
        },
        error: (err) => console.error('Error al quitar favorito', err),
      });
    } else {

      console.log('Enviando favorito:', { cortometrajeId: cortoId });
      console.log('Está logueado:', this.authService.isLoggedIn());

      this.cortometrajeService.addToFavorites(cortoId).subscribe({
        next: (res) => {
          this.estaEnWatchLater.set(true);
          this.favoriteId = res.id;
        },
        error: (err) => {
          console.error('Error al añadir favorito:', err);
          console.error('Mensaje del servidor:', err.error?.message || err.message);
        }
      });
    }
  }

  checkIfFavorite(cortoId: number): void {
    this.cortometrajeService.getMyFavorites().subscribe({
      next: (favorites) => {
        const match = favorites.find((fav: any) => fav.cortometraje && fav.cortometraje.id === cortoId);
        if (match) {
          this.favoriteId = match.id;
          this.estaEnWatchLater.set(true);
        }
      },
      error: (err) => console.error('Error comprobando favoritos', err),
    });
  }

  videoUrlSanitizado(): SafeResourceUrl {
    const videoUrl = this.cortometraje()?.videoUrl ?? '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedUrl(videoUrl));
  }

  private convertToEmbedUrl(url: string): string {
    const match = url.match(/(?:youtube\.com.*(?:\?v=|embed\/)|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  }

  volverAtras(): void {
    this.location.back();
  }

}
