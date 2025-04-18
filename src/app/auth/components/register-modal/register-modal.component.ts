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

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-modal.component.html',
})
export class RegisterModalComponent {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() openLogin = new EventEmitter<void>();

  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      profileImage: [''],
      country: [''],
      socialLinks: [''],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  register() {
    if (this.registerForm.invalid) return;

    const data: RegisterRequestDto = this.registerForm.value;

    this.authService.register(data).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res.data);
        this.close.emit();
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
  
}
