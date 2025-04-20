import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-autor-cortometrajes',
  standalone: true,
  templateUrl: './autor-cortometrajes.component.html',
  imports: [RouterModule],
})
export class AutorCortometrajesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cortometrajeService = inject(CortometrajeService);
  private userService = inject(UserService);

  autor: string = '';
  cortometrajesFiltrados: Cortometraje[] = [];
  userData: User | null = null;

  ngOnInit(): void {
    this.autor = this.route.snapshot.paramMap.get('nombre') ?? '';

    this.userService.getUserByUsername(this.autor).subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: () => {
        this.userData = null;
      }
    });

    this.cortometrajeService.getCortometrajesByAuthor(this.autor).subscribe({
      next: (data) => {
        this.cortometrajesFiltrados = data;
      },
      error: (err) => {
        console.error('Error cargando cortos del autor:', err);
      },
    });
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/img/imgnull.svg';
  }

}
