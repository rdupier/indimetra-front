import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { CortosManagementComponent } from './pages/cortos-management/cortos-management.component';
import { ReviewsManagementComponent } from './pages/reviews-management/reviews-management.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'usuarios', component: UserManagementComponent },
      { path: 'videos', component: CortosManagementComponent },
      { path: 'reseñas', component: ReviewsManagementComponent },
    ],
  },
];

