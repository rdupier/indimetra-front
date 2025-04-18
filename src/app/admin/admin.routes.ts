import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { VideosManagementComponent } from './pages/videos-management/videos-management.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';
import { ReviewsManagementComponent } from './pages/reviews-management/reviews-management.component';
import { FiltersManagementComponent } from './pages/filters-management/filters-management.component';
import { adminGuard } from '../shared/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'videos', pathMatch: 'full' },
      { path: 'videos', component: VideosManagementComponent },
      { path: 'users', component: UsersManagementComponent },
      { path: 'reviews', component: ReviewsManagementComponent },
      { path: 'filters', component: FiltersManagementComponent },
    ],
  },
];

