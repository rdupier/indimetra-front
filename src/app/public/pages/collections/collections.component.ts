import { Component, inject, OnInit, signal } from '@angular/core';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { CategoryService } from '../../../core/services/category.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { CategoryResponseDto } from '../../../core/models/category/category-response.dto';
import { Categoria } from '../../../core/interfaces/categoria.interface';
import { CortometrajeCardComponent } from "../../../shared/components/cortometraje-card/cortometraje-card.component";

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CortometrajeCardComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit {

  private categoryService = inject(CategoryService);
  private cortometrajeService = inject(CortometrajeService);

  // para guardar los nombres de las categorias y se actualiza con this.colecciones.set()
  colecciones = signal<string[]>([]);
  // almacena la relacion completa (categoria + sus cortometrajes) y se llena con this.categoriasConCortos.push()
  categoriasConCortos: { categoria: Categoria, cortos: Cortometraje[] }[] = [];

  ngOnInit(): void {
    this.loadData();
  }

private loadData(): void {
  this.categoryService.getAllCategories().subscribe({
    next: (categorias) => {
      // filtramos solo las categorias deseadas (aqui hemos filtrado por categorias documental, suspense, animacion y musical para no tener que meter tantos videos)
      const categoriasFiltradas = categorias.filter(cat => 
        [2, 7, 9, 10].includes(cat.id)
      );

      // guardamos los nombres en la signal
      this.colecciones.set(categoriasFiltradas.map(cat => cat.name));
      this.loadCortometrajes(categoriasFiltradas);
    },
    error: (err) => console.error('Error cargando categorías', err)
  });
}

  private loadCortometrajes(categorias: Categoria[]): void {
    categorias.forEach(cat => {
      this.cortometrajeService.getCortometrajesByCategory(cat.name).subscribe({
        next: (cortos) => {
          if (cortos.length > 0) {
            this.categoriasConCortos.push({
              categoria: cat,
              cortos: cortos
            });
          }
        },
        error: (err) => console.error('Error cargando cortometrajes', err)
      });
    });
  }

  // para los scrolls
  scrollLeft(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

}
