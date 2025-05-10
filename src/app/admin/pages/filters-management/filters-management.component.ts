import { Component, OnInit, inject, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryResponseDto as Categoria } from '../../../core/models/category/category-response.dto';
import { FormsModule } from '@angular/forms';
import { FiltersFormComponent } from '../../components/filters-form/filters-form.component';

@Component({
  selector: 'app-filters-management',
  standalone: true,
  imports: [FormsModule, FiltersFormComponent],
  templateUrl: './filters-management.component.html',
})
export class FiltersManagementComponent implements OnInit {
  private categoriaService = inject(CategoryService);

  categorias = signal<Categoria[]>([]);
  categoriasFiltradas = signal<Categoria[]>([]);

  filtroNombre = signal('');
  mostrarModal = false;

  paginaActual = signal(0);
  tamanoPagina = signal(10);
  totalPaginas = signal(0);

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getAllCategories().subscribe({
      next: (res) => {
        this.categorias.set(res);
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error cargando categorías', err),
    });
  }

  aplicarFiltros(): void {
    const filtro = this.filtroNombre().toLowerCase().trim();

    let resultado = this.categorias();
    if (filtro) {
      resultado = resultado.filter((c) =>
        c.name.toLowerCase().includes(filtro)
      );
    }

    this.categoriasFiltradas.set(resultado);
    const total = Math.ceil(resultado.length / this.tamanoPagina());
    this.totalPaginas.set(total);
    this.paginaActual.set(0);
  }

  categoriasPaginadas(): Categoria[] {
    const start = this.paginaActual() * this.tamanoPagina();
    const end = start + this.tamanoPagina();
    return this.categoriasFiltradas().slice(start, end);
  }

  siguientePagina(): void {
    if (this.paginaActual() < this.totalPaginas() - 1) {
      this.paginaActual.update((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 0) {
      this.paginaActual.update((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  eliminarCategoria(id: number): void {
    Swal.fire({
      icon: 'question',
      title: '¿Eliminar esta categoría?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A9A59B',
      cancelButtonColor: '#555',
      background: '#2A2929',
      color: '#FFF8F8',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.deleteCategory(id).subscribe({
          next: () => {
            this.categorias.update((lista) => lista.filter((c) => c.id !== id));
            this.aplicarFiltros();
            Swal.fire({
              icon: 'success',
              title: 'Categoría eliminada',
              text: 'La categoría ha sido eliminada correctamente.',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo eliminar',
              text: err.error?.message || 'Error desconocido.',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
          },
        });
      }
    });
  }

  abrirFormularioNuevaCategoria(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  onCategoriaCreada(): void {
    this.loadCategorias();
    this.mostrarModal = false;
  }
}
