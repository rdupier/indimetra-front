import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-cortometraje-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './cortometraje-card.component.html',
})
export class CortometrajeCardComponent {
  @Input() corto!: Cortometraje;
  @Input() mostrarEliminar: boolean = false;
  @Output() eliminar = new EventEmitter<number>();

  public authService = inject(AuthService);
}
