import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.close.emit();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al iniciar sesión';
      }
    });
  }


  closeModal() {
    this.close.emit();
  }
}


