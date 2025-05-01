import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';

@Component({
  selector: 'app-cortometraje-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './cortometraje-card.component.html'
})
export class CortometrajeCardComponent {
  @Input() corto!: Cortometraje;

}
