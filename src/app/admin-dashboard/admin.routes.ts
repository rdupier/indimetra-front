import { Routes } from '@angular/router';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: ManageUsersComponent },
];
