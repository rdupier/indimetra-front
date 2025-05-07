import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-filters-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filters-form.component.html',
})
export class FiltersFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  @Output() cerrar = new EventEmitter<void>();
  @Output() categoriaCreada = new EventEmitter<void>();

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/\S/),
        ],
      ],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  crearCategoria(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.categoryService.createCategory(this.form.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Categoría creada',
          text: 'La nueva categoría se ha creado correctamente.',
          confirmButtonColor: '#A9A59B',
          background: '#2A2929',
          color: '#FFF8F8',
        });
        this.form.reset();
        this.categoriaCreada.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No se pudo crear la categoría.',
          confirmButtonColor: '#A9A59B',
          background: '#2A2929',
          color: '#FFF8F8',
        });
      },
    });
  }
}
