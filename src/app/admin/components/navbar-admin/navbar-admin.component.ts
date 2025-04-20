import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar-admin.component.html',
})
export class NavbarAdminComponent {
  private authService = inject(AuthService);

  showMobileMenu = signal(false);
  isDesktop = signal(window.innerWidth >= 768);

  logout() {
    this.authService.logout();
  }
}

