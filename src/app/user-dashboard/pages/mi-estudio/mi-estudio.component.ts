import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ObrasFormComponent } from '../../../shared/components/obras-form-modal/obras-form-modal.component';
import { User } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';

@Component({
  selector: 'app-mi-estudio',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule, RouterLinkActive, ObrasFormComponent],
  templateUrl: './mi-estudio.component.html',
  styleUrl: './mi-estudio.component.css',
})
export class MiEstudioComponent implements OnInit {
  user = signal<User | null>(null);
  obras = signal<Cortometraje[]>([]);
  modalSubida = signal<{ visible: boolean; editMode: boolean; obra?: Cortometraje }>({
  visible: false,
  editMode: false,
});


  username = computed(() => this.user()?.username || 'Usuario');

  constructor(
    private authService: AuthService,
    private cortometrajeService: CortometrajeService
  ) {}

  ngOnInit(): void {
    this.user.set(this.authService.currentUser());

    if (this.user()?.username) {
      this.recargarObras();
    }
  }

  abrirModalSubida() {
    this.modalSubida.set({ visible: true, editMode: false });
  }

  editarObra(obra: Cortometraje) {
    this.modalSubida.set({ visible: true, editMode: true, obra });
  }

  cerrarModalSubida() {
    this.modalSubida.set({ visible: false, editMode: false, obra: undefined });
  }

  crearNuevaObra(data: Partial<Cortometraje>): void {
    this.cortometrajeService.createCortometraje(data).subscribe({
      next: (res) => {
        console.log('Obra creada con éxito:', res);
        this.modalSubida.set({ visible: false, editMode: false });
      },
      error: (err) => console.error('Error al crear la obra:', err),
    });
  }

  actualizarObra(data: Partial<Cortometraje>): void {
  const obraOriginal = this.modalSubida().obra;

  if (!obraOriginal || !obraOriginal.id) {
    console.error('No hay obra válida para editar');
    return;
  }

  this.cortometrajeService.updateCortometraje(obraOriginal.id, data).subscribe({
    next: (res) => {
      console.log('Obra actualizada con éxito:', res);
      this.modalSubida.set({ visible: false, editMode: false, obra: undefined });
    },
    error: (err) => console.error('Error al actualizar la obra:', err),
  });
}

  recargarObras(): void {
    const username = this.user()?.username;
    if (!username) return;

    this.cortometrajeService.getCortometrajesByAuthor(username).subscribe({
      next: (obras) => {
        this.obras.set(obras);
      },
      error: (err) => console.error('Error al recargar obras:', err),
    });
  }

}
