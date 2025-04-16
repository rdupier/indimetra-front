import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  constructor(private cortometrajeService: CortometrajeService) {}

  ngOnInit(): void {
    this.cortometrajeService.getAllCortometrajes().subscribe({
      next: (data: any) => (this.cortometrajes = data.data),
      error: (err) => console.error('Error al cargar cortometrajes:', err),
    });
  }

  ngAfterViewInit() {
    if (this.heroVideo && this.heroVideo.nativeElement) {
      this.heroVideo.nativeElement.muted = true;
      this.heroVideo.nativeElement.volume = 0;
    }
  }
}
