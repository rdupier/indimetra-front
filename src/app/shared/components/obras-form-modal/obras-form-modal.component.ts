import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { CortometrajeService } from '../../../core/services/cortometraje.service';
import { Cortometraje } from '../../../core/interfaces/cortometraje.interface';
import { FiltroSelectComponent } from '../filtro-select/filtro-select.component';

@Component({
  selector: 'app-obras-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FiltroSelectComponent],
  templateUrl: './obras-form-modal.component.html',
})
export class ObrasFormComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() cortometraje?: Cortometraje;
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;
  formTouched = false;

  selectedCategory: string | null = null;
  selectedTechnique: string | null = null;
  selectedLanguage: string | null = null;
  selectedReleaseYear: string | null = null;
  selectedDuration: string | null = null;

  generosPlaceholder = 'Escoge categoría';
  tecnicaPlaceholder = 'Selecciona técnica';
  idiomasPlaceholder = 'Escoge idioma';
  yearsPlaceholder = 'Año de lanzamiento';
  duracionesPlaceholder = 'Duración (1–59)';

  generos: string[] = [];
  years: string[] = [];
  duraciones = [
    { label: '< 5 min', value: 4 },
    { label: '5-10 min', value: 8 },
    { label: '10-20 min', value: 15 },
    { label: '> 20 min', value: 25 },
  ];
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

  get duracionLabels(): string[] {
    return this.duraciones.map(d => d.label);
  }

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private cortometrajeService: CortometrajeService
  ) {
    this.form = this.fb.group({
      title: ['', { validators: [Validators.required], }],
      description: ['', { validators: [Validators.required, Validators.minLength(10)], }],
      category: ['', Validators.required],
      technique: [[], Validators.required],
      videoUrl: ['', { validators: [Validators.required, Validators.pattern('https?://.+')], }],
      imageUrl: ['', { validators: [Validators.required, Validators.pattern('https?://.+')],}],
      releaseYear: ['', { validators: [Validators.required, Validators.min(1950), Validators.max(new Date().getFullYear())], }],
      duration: ['', { validators: [Validators.required, Validators.min(1), Validators.max(59)], }],
      language: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((cats) => {
      this.generos = cats.map((c) => c.name);
    });

    this.cortometrajeService.getAllLanguages().subscribe((langs) => {
      this.idiomas = langs;
    });

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (currentYear - i).toString());

    if (this.isEditMode && this.cortometraje) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    this.formTouched = true;

    const durationMap: { [label: string]: number } = {
      '< 5 min': 4,
      '5-10 min': 8,
      '10-20 min': 15,
      '> 20 min': 25
    };

    const duration = this.selectedDuration ? durationMap[this.selectedDuration] : null;
    const releaseYear = this.selectedReleaseYear ? Number(this.selectedReleaseYear) : null;

    this.form.patchValue({
      category: this.selectedCategory,
      technique: this.selectedTechnique ? [this.selectedTechnique] : [],
      language: this.selectedLanguage,
      releaseYear,
      duration,
    });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('Formulario incompleto');
      return;
    }

    const newCortometraje: Partial<Cortometraje> = {
      ...this.form.value,
      technique: this.form.value.technique.join(', ')
    };

    this.submit.emit(newCortometraje);
    this.saved.emit();
    this.resetForm();
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  getDurationLabel(duration: number): string | null {
    if (duration <= 4) return '< 5 min';
    if (duration <= 10) return '5-10 min';
    if (duration <= 20) return '10-20 min';
    return '> 20 min';
  }

  resetForm(): void {
    if (this.isEditMode && this.cortometraje) {
    this.form.patchValue({
      title: this.cortometraje.title,
      description: this.cortometraje.description,
      category: this.cortometraje.category,
      videoUrl: this.cortometraje.videoUrl,
      imageUrl: this.cortometraje.imageUrl,
      releaseYear: this.cortometraje.releaseYear,
      duration: this.cortometraje.duration,
      language: this.cortometraje.language,
      technique: this.cortometraje.technique
        ? this.cortometraje.technique.split(',').map(t => t.trim())
        : [],
    });

    this.selectedCategory = this.cortometraje.category;
    this.selectedTechnique = this.cortometraje.technique?.split(',')[0] ?? null;
    this.selectedLanguage = this.cortometraje.language;
    this.selectedReleaseYear = String(this.cortometraje.releaseYear);
    this.selectedDuration = this.getDurationLabel(this.cortometraje.duration);
    this.formTouched = false;
    return;
  }

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

    this.selectedCategory = null;
    this.selectedTechnique = null;
    this.selectedLanguage = null;
    this.selectedReleaseYear = null;
    this.selectedDuration = null;
  }

}
