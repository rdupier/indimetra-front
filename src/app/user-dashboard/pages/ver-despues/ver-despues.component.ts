import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Favorite } from '../../../core/interfaces/favorite.interface';

@Component({
  selector: 'app-ver-despues',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './ver-despues.component.html'
})
export class VerDespuesComponent implements OnInit {
  favoritos = signal<Favorite[]>([]);

  constructor(
    private cortometrajeService: CortometrajeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cortometrajeService.getMyFavorites().subscribe({
      next: (res) => {
        this.favoritos.set(res);
      },
      error: (err) => console.error('Error al cargar favoritos', err),
    });
  }

  eliminarDeFavoritos(favoriteId: number) {
    this.cortometrajeService.removeFromFavorites(favoriteId).subscribe({
      next: () => {
        const nuevosFavoritos = this.favoritos().filter(f => f.id !== favoriteId);
        this.favoritos.set(nuevosFavoritos);
      },
      error: (err) => console.error('Error al eliminar de favoritos:', err),
    });
  }

  explorar() {
    this.router.navigate(['/explorar']);
  }

}
