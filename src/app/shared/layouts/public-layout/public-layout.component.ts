import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './public-layout.component.html',
})
export class PublicLayoutComponent {}

