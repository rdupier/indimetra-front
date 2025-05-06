import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { UserService } from '../../../core/services/user.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { User } from '../../../core/interfaces/user.interface';
import Swal from 'sweetalert2';
import { NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CortometrajeCardComponent } from "../../../shared/components/cortometraje-card/cortometraje-card.component";

@Component({
  selector: 'app-autor-cortometraje-admin',
  standalone: true,
  templateUrl: './autor-cortometraje-admin.component.html',
  imports: [NgIf, NgFor, RouterModule, CortometrajeCardComponent],
})
export class AutorCortometrajeAdminComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cortometrajeService = inject(CortometrajeService);
  private userService = inject(UserService);

  autor: string = '';
  cortometrajesFiltrados: Cortometraje[] = [];
  userData: User | null = null;

  ngOnInit(): void {
    this.autor = this.route.snapshot.paramMap.get('nombre') ?? '';
    this.userService.getUserByUsername(this.autor).subscribe({
      next: (data) => (this.userData = data),
      error: () => (this.userData = null),
    });

    this.loadCortos();
  }

  loadCortos(): void {
    this.cortometrajeService.getCortometrajesByAuthor(this.autor).subscribe({
      next: (data) => (this.cortometrajesFiltrados = data),
      error: (err) => console.error('Error cargando cortos del autor:', err),
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/img/imgnull.svg';
  }

  onEliminarCortometraje(id: number): void {
    Swal.fire({
      icon: 'warning',
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
            this.cortometrajesFiltrados = this.cortometrajesFiltrados.filter(
              (c) => c.id !== id
            );
            Swal.fire({
              icon: 'success',
              title: 'Cortometraje eliminado',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el cortometraje.',
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
