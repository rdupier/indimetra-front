import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { LegalModalComponent } from '../../../auth/components/legal-modal/legal-modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { RegisterRequestDto } from '../../../auth/models/register-request.dto';
import { LoginModalComponent } from '../../../auth/components/login-modal/login-modal.component';
import { ModalService } from '../../../shared/modal.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LegalModalComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() openLogin = new EventEmitter<void>();
  @Output() openLegal = new EventEmitter<void>();
  @Output() switchToLoginModal = new EventEmitter<void>();

  registerForm: FormGroup;
  errorMessage: string = '';
  legalVisible: boolean = false;

  showLegalModal = signal(false);
  showLoginModal = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
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
      socialLinks: ['',
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

  switchToLogin() {
    this.switchToLoginModal.emit();
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

  openLegalModal() {
    this.showLegalModal.set(true);
  }

  closeLegalModal() {
    this.showLegalModal.set(false);
  }

  abrirModalLogin() {
    this.modalService.showLoginModal.set(true);
  }

}
