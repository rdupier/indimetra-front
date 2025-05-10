import { Routes } from '@angular/router';
import { MiEstudioComponent } from './pages/mi-estudio/mi-estudio.component';
import { VerDespuesComponent } from './pages/ver-despues/ver-despues.component';
import { GestionObrasComponent } from './pages/gestion-obras/gestion-obras.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import { ObrasFormComponent } from '../shared/components/obras-form-modal/obras-form-modal.component';

export const USER_ROUTES: Routes = [
  {
    path: 'studio',
    component: MiEstudioComponent,
    children: [
      { path: '', redirectTo: 'gestion-obras', pathMatch: 'full' },
      { path: 'gestion-obras', component: GestionObrasComponent },
      { path: 'ver-despues', component: VerDespuesComponent },
      { path: 'editar-perfil', component: EditarPerfilComponent }
    ]
  },
  { path: 'obras-form', component: ObrasFormComponent },
];
