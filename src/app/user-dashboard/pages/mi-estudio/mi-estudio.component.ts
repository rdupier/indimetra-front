import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { UploadModalComponent } from '../../../shared/components/upload-modal/upload-modal.component';
import { User } from '../../../core/interfaces/user.interface';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { CortometrajeService } from '../../../core/services/cortometraje.service';


@Component({
  selector: 'app-mi-estudio',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule, UploadModalComponent],
  templateUrl: './mi-estudio.component.html',
  styleUrl: './mi-estudio.component.css',
})
export class MiEstudioComponent implements OnInit {
  user = signal<User | null>(null);
  favoritos = signal<Cortometraje[]>([]);

  username = computed(() => this.user()?.username || 'Usuario');

  modalSubida = signal(false);
    cerrarModalSubida() {
      this.modalSubida.set(false);
    }


  constructor(
    private authService: AuthService,
    private cortometrajeService: CortometrajeService
  ) {}

  ngOnInit(): void {
    this.user.set(this.authService.currentUser());

    this.cortometrajeService.getMyFavorites().subscribe({
      next: (res) => {
        const cortos = res.map((fav: any) => fav.cortometraje).filter(Boolean);
        this.favoritos.set(cortos);
      },
      error: (err) => console.error('Error al cargar favoritos', err),
    });
  }

  abrirModalSubida() {
    this.modalSubida.set(true);
  }

  verMisMetrajes() {

  }

  editarPerfil() {

  }

  // crearNuevaObra(data: any): void {
  //   this.cortometrajeService.createCortometraje(data).subscribe({
  //     next: (response) => {
  //       console.log('Obra creada con éxito:', response);
  //       this.modalSubida.set(false);
  //       this.verMisMetrajes();
  //     },
  //     error: (error) => {
  //       console.error('Error al crear la obra:', error);
  //     },
  //   });
  // }

  crearNuevaObra(data: any): void {
    const newCortometraje = {
      title: data.title,
      description: data.description,
      technique: data.technique,
      releaseYear: Number(data.releaseYear),
      duration: Number(data.duration),
      language: data.language,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      category: data.category
    };

    console.log('Enviando al backend:', newCortometraje);

    this.cortometrajeService.createCortometraje(newCortometraje).subscribe({
      next: (response) => {
        console.log('Obra creada con éxito:', response);
        this.modalSubida.set(false);
        this.verMisMetrajes();
      },
      error: (error) => {
        console.error('Error al crear la obra:', error);
      }
    });
  }

}

