import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../../auth/services/auth.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { Review } from '../../../core/interfaces/review.interface';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cortometraje-detail-admin',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cortometraje-detail-admin.component.html',
})
export class CortometrajeDetailAdminComponent implements OnInit {
  constructor(private fb: FormBuilder, private location: Location) { }

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cortometrajeService = inject(CortometrajeService);
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

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) return;

    this.cortometrajeService.getCortometrajeById(id).subscribe({
      next: (data: any) => {
        this.cortometraje.set(data.data);
      },
      error: (err) => console.error('Error cargando cortometraje', err),
    });

    this.formValoracion = this.fb.group({
      rating: [0, [Validators.min(1)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  videoUrlSanitizado(): SafeResourceUrl {
    const videoUrl = this.cortometraje()?.videoUrl ?? '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.convertToEmbedUrl(videoUrl)
    );
  }

  showReviewsMenu() {
    console.log('showReviewsMenu');
  }

  onEliminarCortometraje(id: number) {
    Swal.fire({
      icon: 'question',
      title: '¿Eliminar cortometraje?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A9A59B',
      cancelButtonColor: '#555',
      background: '#2A2929',
      color: '#FFF8F8',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cortometrajeService.eliminarCortometraje(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cortometraje eliminado',
              text: 'El cortometraje ha sido eliminado correctamente.',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            }).then(() => {
              this.router.navigate(['/admin/videos']);
            });
          },
          error: (err) => {
            console.error('Error al eliminar cortometraje', err);

            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'No se pudo eliminar el cortometraje. Intenta nuevamente.',
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

  private convertToEmbedUrl(url: string): string {
    const match = url.match(
      /(?:youtube\.com.*(?:\?v=|embed\/)|youtu\.be\/)([^&]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  }


  volverAtras(): void {
    this.location.back();
  }

}
