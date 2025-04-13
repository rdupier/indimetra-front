import { Component, OnInit } from '@angular/core';
import { CortometrajeService } from '../../../auth/services/cortometraje.service';
import { Cortometraje } from '../../../auth/interfaces/cortometraje.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [RouterModule],
})
export class HomeComponent implements OnInit {
  cortometrajes: Cortometraje[] = [];

  constructor(private cortometrajeService: CortometrajeService) {}

  ngOnInit(): void {
    this.cortometrajeService.getAllCortometrajes().subscribe({
      next: (data) => (this.cortometrajes = data),
      error: (err) => console.error('Error al cargar cortometrajes:', err),
    });
  }
}
