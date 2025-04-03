import { Routes } from '@angular/router';
import { UploadComponent } from './pages/upload/upload.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';

export const USER_ROUTES: Routes = [
  { path: 'upload', component: UploadComponent },
  { path: 'favorites', component: FavoritesComponent },
];
