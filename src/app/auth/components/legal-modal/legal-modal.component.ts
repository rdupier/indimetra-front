import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal-modal',
  imports: [],
  templateUrl: './legal-modal.component.html',
})
export class LegalModalComponent {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
