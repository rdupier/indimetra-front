import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarAdminComponent } from '../../components/navbar-admin/navbar-admin.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, NavbarAdminComponent, FooterComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {}

