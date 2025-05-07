import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { VideosManagementComponent } from './pages/videos-management/videos-management.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';
import { ReviewsManagementComponent } from './pages/reviews-management/reviews-management.component';
import { FiltersManagementComponent } from './pages/filters-management/filters-management.component';
import { adminGuard } from '../shared/guards/admin.guard';
import { CortometrajeDetailAdminComponent } from './pages/cortometraje-detail-admin/cortometraje-detail-admin.component';
import { AutorCortometrajeAdminComponent } from './pages/autor-cortometraje-admin/autor-cortometraje-admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'videos', pathMatch: 'full' },
      { path: 'videos', component: VideosManagementComponent },
      { path: 'cortometraje/:id', component: CortometrajeDetailAdminComponent },
      { path: 'users', component: UsersManagementComponent },
      { path: 'reviews', component: ReviewsManagementComponent },
      { path: 'filters', component: FiltersManagementComponent },
      { path: 'autor/:nombre', component: AutorCortometrajeAdminComponent },
    ],
  },
];
