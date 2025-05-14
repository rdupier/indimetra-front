import { RouterLink } from '@angular/router';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { ObrasFormComponent } from '../../../shared/components/obras-form-modal/obras-form-modal.component';

@Component({
  selector: 'app-gestion-obras',
  standalone: true,
  imports: [RouterLink, CommonModule, ObrasFormComponent],
  templateUrl: './gestion-obras.component.html',
})
export class GestionObrasComponent implements OnInit {
  obras = signal<Cortometraje[]>([]);
  modalAbierto = signal(false);
  cortometrajeEditando = signal<Cortometraje | null>(null);

  constructor(
    private cortometrajeService: CortometrajeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.recargarObras();
  }

  abrirModalEdicion(corto: Cortometraje) {
    this.modalAbierto.set(true);
    this.cortometrajeEditando.set(corto);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.cortometrajeEditando.set(null);
  }

  actualizarObra(data: Partial<Cortometraje>) {
    const original = this.cortometrajeEditando();
    if (!original?.id) {
      console.error('No hay obra válida para editar');
      return;
    }

    this.cortometrajeService.updateCortometraje(original.id, data).subscribe({
      next: () => {
        this.recargarObras();
        this.cerrarModal();
      },
      error: (err) => console.error('Error al actualizar la obra:', err),
    });
  }

  confirmarEliminar(id: number) {
    const confirmado = window.confirm('¿Estás seguro de eliminar esta obra?');
    if (!confirmado) return;

    this.cortometrajeService.deleteCortometraje(id).subscribe({
      next: () => {
        const nuevasObras = this.obras().filter((c) => c.id !== id);
        this.obras.set(nuevasObras);
      },
      error: (err) => console.error('Error al eliminar cortometraje:', err),
    });
  }

  recargarObras() {
    const username = this.authService.currentUser()?.username;
    if (!username) return;

    this.cortometrajeService.getCortometrajesByAuthor(username).subscribe({
      next: (res) => this.obras.set(res),
      error: (err) => console.error('Error recargando obras:', err),
    });
  }
}
