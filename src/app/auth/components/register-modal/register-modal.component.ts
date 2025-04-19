import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterRequestDto } from '../../models/register-request.dto';
import { Router } from '@angular/router';
import { LegalModalComponent } from '../legal-modal/legal-modal.component';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LegalModalComponent],
  templateUrl: './register-modal.component.html',
})
export class RegisterModalComponent {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() openLogin = new EventEmitter<void>();
  @Output() openLegal = new EventEmitter<void>();

  registerForm: FormGroup;
  errorMessage: string = '';
  legalVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^(?!\d+$).+$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      profileImage: [
        '',
        [Validators.pattern(/^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/)],
      ],
      country: ['', [Validators.required]],
      socialLinks: [
        '',
        [
          Validators.pattern(
            /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=.]+)?$/
          ),
        ],
      ],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  register() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    const data: RegisterRequestDto = this.registerForm.value;

    this.authService.register(data).subscribe({
      next: (res) => {
        this.authService.login(data.username, data.password).subscribe({
          next: () => {
            this.close.emit();
            // this.router.navigate(['/menu']);
          },
          error: (err) => {
            this.errorMessage =
              'Registro correcto, pero error al iniciar sesión.';
            console.error(err);
          },
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al registrar';
      },
    });
  }

  closeModal() {
    this.close.emit();
  }

  switchToLogin() {
    this.close.emit();
    this.openLogin.emit();
  }

  onRegisterClick() {
    this.registerForm.markAllAsTouched();
    const termsControl = this.registerForm.get('termsAccepted');

    if (this.registerForm.valid) {
      this.register();
    } else {
      if (termsControl && termsControl.invalid && !termsControl.touched) {
        termsControl.markAsTouched();
      }
    }
  }

  closeLegalModal() {
    this.legalVisible = false;
  }

  openLegalModal() {
    this.close.emit();
    this.openLegal.emit();
  }
}
