import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isAdmin = computed(() => this.authService.isAdmin());
  user = computed(() => this.authService.currentUser());

  showLoginModal = signal(false);
  showMobileMenu = signal(false);

  // Detectar si está en escritorio (solo al cargar)
  isDesktop = signal(window.innerWidth >= 768);

  logout() {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.showMobileMenu.update(v => !v);
  }
}
