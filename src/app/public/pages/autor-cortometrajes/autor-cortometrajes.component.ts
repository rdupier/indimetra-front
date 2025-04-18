import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';

@Component({
  selector: 'app-autor-cortometrajes',
  standalone: true,
  templateUrl: './autor-cortometrajes.component.html',
  imports: [RouterModule],
})
export class AutorCortometrajesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cortometrajeService = inject(CortometrajeService);

  autor: string = '';
  cortometrajesFiltrados: Cortometraje[] = [];

  ngOnInit(): void {
    this.autor = this.route.snapshot.paramMap.get('nombre') ?? '';

    this.cortometrajeService.getAllCortometrajes().subscribe((data) => {
      this.cortometrajesFiltrados = data.filter(
        (c) => c.author.toLowerCase() === this.autor.toLowerCase()
      );
    });

    // cuando esté el endpoint:
    // this.cortometrajeService.getCortometrajesByAuthor(this.autor).subscribe({
    //   next: (data) => {
    //     this.cortometrajesFiltrados = data;
    //   },
    //   error: (err) => {
    //     console.error('Error cargando cortometrajes del autor:', err);
    //   },
    // });

  }
}
