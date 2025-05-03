import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { FiltroSelectComponent } from '../filtro-select/filtro-select.component';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FiltroSelectComponent],
  templateUrl: './upload-modal.component.html',
})
export class UploadModalComponent implements OnInit {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  form: FormGroup;
  formTouched = false;

  generos: string[] = [];
  years: string[] = [];
  duraciones: string[] = ['< 5 min', '5-10 min', '10-20 min', '> 20 min'];
  idiomas: string[] = [];


  tecnicasDisponibles: string[] = [
    'Plano Secuencia',
    'Animación 2D',
    'Animación 3D',
    'Cine Analógico',
    'Stop Motion',
    'Blanco y Negro',
    'Musical',
    'Experimental',
    'Pintura sobre vidrio',
    'Rotoscopía',
    'Imágenes de archivo',
    'Mezcla de formatos digitales',
    'Collage digital',
  ];

  duracionesDisponibles: string[] = [
    '< 5 min',
    '5-10 min',
    '10-20 min',
    '> 20 min'
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private cortometrajeService: CortometrajeService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required, Validators.minLength(10)],
      category: ['', Validators.required],
      technique: [[], Validators.required],
      videoUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      releaseYear: ['', [Validators.required, Validators.min(1950), Validators.max(new Date().getFullYear())]],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(59)]],
      language: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.form.get('category')?.valueChanges.subscribe(val => this.form.get('category')?.setValue(val));
    this.form.get('technique')?.valueChanges.subscribe(val => this.form.get('technique')?.setValue(val));
    this.form.get('language')?.valueChanges.subscribe(val => this.form.get('language')?.setValue(val));
    this.form.get('releaseYear')?.valueChanges.subscribe(val => this.form.get('releaseYear')?.setValue(val));

    this.categoryService.getAllCategories().subscribe((cats) => {
      this.generos = ['Escoge categoría', ...cats.map((c) => c.name)];
    });

    this.cortometrajeService.getAllLanguages().subscribe((langs) => {
      this.idiomas = ['Escoge idioma', ...langs];
    });

    const currentYear = new Date().getFullYear();
    this.years = ['Año de lanzamiento', ...Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (currentYear - i).toString())];

    this.duraciones = ['Duración (1–59)', ...this.duraciones];
    this.tecnicasDisponibles = ['Selecciona técnica', ...this.tecnicasDisponibles];
  }

  onSubmit(): void {
    this.formTouched = true;

    const { category, technique, language, releaseYear, duration } = this.form.value;

    // Si el usuario no ha cambiado el valor del placeholder
    if (
      category === 'Escoge categoría' ||
      language === 'Escoge idioma' ||
      releaseYear === 'Año de lanzamiento' ||
      duration === 'Duración (1–59)' ||
      technique.includes('Selecciona técnica')
    ) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const newCortometraje: Partial<Cortometraje> = {
      title: formValue.title,
      description: formValue.description,
      technique: formValue.technique.join(', '),
      releaseYear: Number(formValue.releaseYear),
      duration: Number(formValue.duration),
      language: formValue.language,
      videoUrl: formValue.videoUrl,
      imageUrl: formValue.imageUrl,
      category: formValue.category
    };

    this.submit.emit(newCortometraje);
    this.resetForm();
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }


  resetForm(): void {
    this.form.reset({
      title: '',
      description: '',
      category: '',
      technique: [],
      videoUrl: '',
      imageUrl: '',
      releaseYear: '',
      duration: '',
      language: ''
    });

    this.formTouched = false;
  }

}
