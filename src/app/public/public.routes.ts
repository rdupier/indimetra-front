import { Routes } from '@angular/router';
import { PublicLayoutComponent } from '../shared/layouts/public-layout/public-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { GenresComponent } from './pages/genres/genres.component';
import { TechniquesComponent } from './pages/techniques/techniques.component';


export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'explore', component: ExploreComponent },
      { path: 'genres', component: GenresComponent },
      { path: 'techniques', component: TechniquesComponent },
    ],
  },
];

