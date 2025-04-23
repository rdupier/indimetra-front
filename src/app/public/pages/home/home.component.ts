import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { CortometrajeService } from '../../../core/services/cortometraje.service';

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
    this.cortometrajeService.getTop5Latest().subscribe({
      next: (data) => (this.cortometrajes = data.slice(0, 4)),
      error: (err) =>
        console.error('Error al cargar los cortometrajes más recientes:', err),
    });
  }

  ngAfterViewInit() {
    if (this.heroVideo && this.heroVideo.nativeElement) {
      this.heroVideo.nativeElement.muted = true;
      this.heroVideo.nativeElement.volume = 0;
    }
  }
  
}
