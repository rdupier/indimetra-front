import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";
import { LoginModalComponent } from '../../../auth/components/login-modal/login-modal.component';
import { ModalService } from '../../modal.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoginModalComponent],
  templateUrl: './public-layout.component.html',
})
export class PublicLayoutComponent {
  constructor(public modalService: ModalService) {}

}

