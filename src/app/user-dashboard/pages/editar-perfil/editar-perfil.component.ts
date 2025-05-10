import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
})
export class EditarPerfilComponent implements OnInit {
  perfilForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      profileImage: ['', [Validators.required, Validators.pattern('https?://.+')]],
      newPassword: [''],
      repeatPassword: [''],
      country: ['', Validators.required],
      socialLinks: ['', Validators.pattern('https?://.+')],
    });
  }

  onSubmit(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const formData = this.perfilForm.value;

    if (formData.newPassword && formData.newPassword !== formData.repeatPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    console.log('Datos a enviar:', formData);
    // Aquí irá la llamada al endpoint de actualización
  }
}
