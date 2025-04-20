import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginModalComponent } from '../../../auth/components/login-modal/login-modal.component';
import { RegisterModalComponent } from '../../../auth/components/register-modal/register-modal.component';
import { LegalModalComponent } from "../../../auth/components/legal-modal/legal-modal.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    LoginModalComponent,
    RegisterModalComponent,
    LegalModalComponent
],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isAdmin = computed(() => this.authService.isAdmin());
  user = computed(() => this.authService.currentUser());

  showLoginModal = signal(false);
  showRegisterModal = signal(false);
  showMobileMenu = signal(false);
  showLegalModal = signal(false);

  previousModal: 'register' | null = null;

  // Detectar si está en escritorio (solo al cargar)
  isDesktop = signal(window.innerWidth >= 768);

  logout() {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.showMobileMenu.update((v) => !v);
  }

  // Cerrar un modal si el otro se abre
  openLoginModal() {
    this.showRegisterModal.set(false);
    this.showLoginModal.set(true);
  }

  openRegisterModal() {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(true);
  }
}
