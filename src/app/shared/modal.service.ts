import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  showLoginModal = signal(false);
  //showRegisterModal = signal(false);
}
