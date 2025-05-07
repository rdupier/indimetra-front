import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-gestion-obras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-obras.component.html',
  styleUrl: './gestion-obras.component.css',
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
    const username = this.authService.currentUser()?.username;
    if (!username) return;

    this.cortometrajeService.getCortometrajesByAuthor(username).subscribe({
      next: (res) => this.obras.set(res),
      error: (err) => console.error('Error cargando obras del autor:', err),
    });
  }

  editarObra(corto: Cortometraje) {
    this.cortometrajeEditando.set(corto);
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.cortometrajeEditando.set(null);
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
}
