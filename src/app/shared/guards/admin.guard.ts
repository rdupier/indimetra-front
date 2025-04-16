import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  if (!isAdmin) {
    router.navigate(['/']);
    return false;
  }

  return true;
};

