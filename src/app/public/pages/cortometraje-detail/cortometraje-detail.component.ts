import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { Review } from '../../../core/interfaces/review.interface';

@Component({
  selector: 'app-cortometraje-detail',
  standalone: true,
  templateUrl: './cortometraje-detail.component.html',
  imports: [RouterModule],
})
export class CortometrajeDetailComponent implements OnInit {
  // Inyecciones
  private route = inject(ActivatedRoute);
  private cortometrajeService = inject(CortometrajeService);
  private reviewService = inject(ReviewService);
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);

  // Signals reactivos
  cortometraje = signal<Cortometraje | null>(null);
  reviews = signal<Review[]>([]);
  mostrarResenas = signal(false);

  isLoggedIn = computed(() => this.authService.isLoggedIn());

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) return;

    this.cortometrajeService.getCortometrajeById(id).subscribe({
      next: (data: any) => this.cortometraje.set(data.data),
      error: (err) => console.error('Error cargando cortometraje', err),
    });

    this.reviewService.getReviewsByCortometrajeId(id).subscribe({
      next: (res) => this.reviews.set(res),
      error: (err) => console.error('Error al cargar reseñas', err),
    });
  }

  toggleReviews(): void {
    this.mostrarResenas.update((v) => !v);
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
