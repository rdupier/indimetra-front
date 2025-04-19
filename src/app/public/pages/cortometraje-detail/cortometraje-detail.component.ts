import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { Review } from '../../../core/interfaces/review.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cortometraje-detail',
  standalone: true,
  templateUrl: './cortometraje-detail.component.html',
  imports: [RouterModule, FormsModule],
})
export class CortometrajeDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private cortometrajeService = inject(CortometrajeService);
  private reviewService = inject(ReviewService);
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);

  cortometraje = signal<Cortometraje | null>(null);
  reviews = signal<Review[]>([]);
  mostrarResenas = signal(false);
  modalResenas = signal(false);
  estrellaSeleccionada = signal<number>(0);
  comentario = signal('');
  estaEnWatchLater = signal(false);
  favoriteId: number | null = null;

  isLoggedIn = computed(() => this.authService.isLoggedIn());

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
        this.reviews.set(res); // res ya es Review[]
      },
      error: (err) => console.error('Error al cargar reseñas', err),
    });

  }

  toggleReviews(): void {
    this.mostrarResenas.update((v) => !v);
  }

  abrirValoracion(): void {
    this.modalResenas.set(true);
  }

  cerrarValoracion(): void {
    this.modalResenas.set(false);
    this.estrellaSeleccionada.set(0);
    this.comentario.set('');
  }

  seleccionarEstrella(valor: number): void {
    this.estrellaSeleccionada.set(valor);
  }

  enviarValoracion(): void {
    const cortometrajeId = this.cortometraje()?.id;
    const estrellas = this.estrellaSeleccionada();
    const comment = this.comentario().trim();

    if (!cortometrajeId || estrellas < 1 || estrellas > 5) {
      console.warn('Faltan datos válidos para enviar valoración');
      return;
    }

    // // Rating hardcodeado para test
    // const rating = 2.0;

    // const body = {
    //   cortometrajeId,
    //   rating,
    //   comment
    // };

    const rating = Number(estrellas).toFixed(1); // Esto da un string "2.0"
    const parsedRating = parseFloat(rating); // Asegura que va como número 2.0

    const body = {
      cortometrajeId,
      rating: parsedRating,
      comment,
    };


    // JSON para test
    console.log('Enviando:', JSON.stringify(body, null, 2));

    this.reviewService.createReview(body).subscribe({
      next: (nuevaResena) => {
        this.reviews.update(actuales => [...actuales, nuevaResena]);
        this.cerrarValoracion();
      },
      error: (err) => {
        console.error('Error al enviar valoración', err);
      }
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
      this.cortometrajeService.addToFavorites(cortoId).subscribe({
        next: (res) => {
          this.estaEnWatchLater.set(true);
          this.favoriteId = res.id;
        },
        error: (err) => console.error('Error al añadir favorito', err),
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
}
