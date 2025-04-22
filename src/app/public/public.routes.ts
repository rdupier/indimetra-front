import { Routes } from '@angular/router';
import { PublicLayoutComponent } from '../shared/layouts/public-layout/public-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { CortometrajeDetailComponent } from './pages/cortometraje-detail/cortometraje-detail.component';
import { AutorCortometrajesComponent } from './pages/autor-cortometrajes/autor-cortometrajes.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LegalComponent } from './pages/legal/legal.component';
import { RRSSComponent } from './pages/rrss/rrss.component';
import { RegisterComponent } from './pages/register/register.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'explore', component: ExploreComponent },
      { path: 'cortometraje/:id', component: CortometrajeDetailComponent },
      { path: 'autor/:nombre', component: AutorCortometrajesComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'faqs', component: FaqsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'legal', component: LegalComponent },
      { path: 'rrss', component: RRSSComponent }
    ],
  },
];

