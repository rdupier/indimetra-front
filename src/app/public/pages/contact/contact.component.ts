import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LegalModalComponent } from '../../../auth/components/legal-modal/legal-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LegalModalComponent],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  contactForm: FormGroup;
  showLegalModal = signal(false);

  constructor(private fb: FormBuilder, private router: Router) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        ],
      ],
      asunto: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)],
      ],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
      aceptar: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Mensaje enviado:', this.contactForm.value);
      // llamar al servicio de envío de email o API. Por ahora solo imprimimos en consola

      Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Gracias por contactarnos. Te responderemos lo antes posible.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#A9A59B', // secondary
        background: '#2A2929',         // principal
        color: '#FFF8F8',              // primary
      }).then(() => {
        this.contactForm.reset();
        this.router.navigate(['/']);
      });

    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  openLegalModal() {
    this.showLegalModal.set(true);
  }

  closeLegalModal() {
    this.showLegalModal.set(false);
  }
}
