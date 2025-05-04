import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { UploadModalComponent } from '../../../shared/components/upload-modal/upload-modal.component';
import { User } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';

@Component({
  selector: 'app-mi-estudio',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule, UploadModalComponent],
  templateUrl: './mi-estudio.component.html',
  styleUrl: './mi-estudio.component.css',
})
export class MiEstudioComponent implements OnInit {
  user = signal<User | null>(null);
  modalSubida = signal(false);

  username = computed(() => this.user()?.username || 'Usuario');

  constructor(
    private authService: AuthService,
    private cortometrajeService: CortometrajeService
  ) {}

  ngOnInit(): void {
    this.user.set(this.authService.currentUser());
  }

  abrirModalSubida() {
    this.modalSubida.set(true);
  }

  cerrarModalSubida() {
    this.modalSubida.set(false);
  }

  crearNuevaObra(data: Partial<Cortometraje>): void {
    this.cortometrajeService.createCortometraje(data).subscribe({
      next: (res) => {
        console.log('Obra creada con éxito:', res);
        this.modalSubida.set(false);
      },
      error: (err) => console.error('Error al crear la obra:', err),
    });
  }
}
