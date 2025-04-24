import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-select.component.html',
})
export class FiltroSelectComponent {
  @Input() label: string = '';
  @Input() opciones: string[] = [];
  @Input() model: string | null = null;
  @Output() modelChange = new EventEmitter<string | null>();

  onChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const valor = target.value === 'null' ? null : target.value;
    this.model = valor;
    this.modelChange.emit(valor);
  }
}
