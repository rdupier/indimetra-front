import { Routes } from '@angular/router';
import { MiEstudioComponent } from './pages/mi-estudio/mi-estudio.component';
import { UploadComponent } from './pages/upload/upload.component';
import { VerDespuesComponent } from './pages/ver-despues/ver-despues.component';
import { GestionObrasComponent } from './pages/gestion-obras/gestion-obras.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';

export const USER_ROUTES: Routes = [
  {
    path: 'studio',
    component: MiEstudioComponent,
    children: [
      { path: '', redirectTo: 'ver-despues', pathMatch: 'full' },
      { path: 'ver-despues', component: VerDespuesComponent },
      { path: 'gestion-obras', component: GestionObrasComponent },
      { path: 'editar-perfil', component: EditarPerfilComponent }
    ]
  },
  { path: 'upload', component: UploadComponent },
];
