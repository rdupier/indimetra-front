import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginModalComponent } from '../../../auth/components/login-modal/login-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LoginModalComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isAdmin = computed(() => this.authService.isAdmin());
  user = computed(() => this.authService.currentUser());

  showLoginModal = signal(false);

  logout() {
    this.authService.logout();
  }
}
