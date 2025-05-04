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

  // Modelos seleccionados
  selectedCategory: string | null = null;
  selectedTechnique: string | null = null;
  selectedLanguage: string | null = null;
  selectedReleaseYear: string | null = null;
  selectedDuration: string | null = null;

  // Placeholders
  generosPlaceholder = 'Escoge categoría';
  tecnicaPlaceholder = 'Selecciona técnica';
  idiomasPlaceholder = 'Escoge idioma';
  yearsPlaceholder = 'Año de lanzamiento';
  duracionesPlaceholder = 'Duración (1–59)';

  // Opciones
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
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
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
    this.categoryService.getAllCategories().subscribe((cats) => {
      this.generos = cats.map((c) => c.name);
    });

    this.cortometrajeService.getAllLanguages().subscribe((langs) => {
      this.idiomas = langs;
    });

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (currentYear - i).toString());
  }

  onSubmit(): void {
    this.formTouched = true;

    // Convertir duración textual a valor numérico estimado
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

    const {
      category,
      technique,
      language,
      imageUrl,
      videoUrl,
      title,
      description
    } = this.form.value;

    if (
      !title || !description || !technique || !language ||
      !imageUrl || !videoUrl || !category ||
      releaseYear === null || duration === null
    ) {
      console.warn('Formulario incompleto');
      this.form.markAllAsTouched();
      return;
    }

    const newCortometraje: Partial<Cortometraje> = {
      title,
      description,
      technique: technique.join(', '),
      releaseYear,
      duration,
      language,
      videoUrl,
      imageUrl,
      category
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

    // Reset de valores seleccionados
    this.selectedCategory = null;
    this.selectedTechnique = null;
    this.selectedLanguage = null;
    this.selectedReleaseYear = null;
    this.selectedDuration = null;
  }
}
