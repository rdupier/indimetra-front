import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-valorar-modal',
  standalone: true,
  templateUrl: './valorar-modal.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class ValorarModalComponent {
  @Input() visible = false;
  @Input() title: string = '';
  @Input() form!: FormGroup;
  @Input() errorMessage!: string;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ rating: number; comment: string }>();

  formTouched = false;

  setRating(valor: number): void {
    this.form.get('rating')?.setValue(valor);
  }

  onSubmit(): void {
    this.formTouched = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submit.emit(this.form.value);
  }

  onClose(): void {
    this.close.emit();
  }
}
