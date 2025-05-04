import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ver-despues',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-despues.component.html'
})
export class VerDespuesComponent implements OnInit {
  favoritos = signal<Cortometraje[]>([]);

  constructor(private cortometrajeService: CortometrajeService) {}

  ngOnInit(): void {
    this.cortometrajeService.getMyFavorites().subscribe({
      next: (res) => {
        const cortos = res.map((f: any) => f.cortometraje).filter(Boolean);
        this.favoritos.set(cortos);
      },
      error: (err) => console.error('Error al cargar favoritos', err),
    });
  }
}
