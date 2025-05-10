import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
})
export class EditarPerfilComponent implements OnInit {
  perfilForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();

    if (!user) return;

    this.perfilForm = this.fb.group({
      profileImage: [user.profileImage || '', [Validators.required, Validators.pattern('https?://.+')]],
      newPassword: [''],
      repeatPassword: [''],
      country: [user.country || '', Validators.required],
      socialLinks: [user.socialLinks || '', Validators.pattern('https?://.+')],
    });
  }

  onSubmit(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const { profileImage, socialLinks, country, newPassword, repeatPassword } = this.perfilForm.value;

    if (newPassword && newPassword !== repeatPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const perfilPayload = {
      profileImage,
      socialLinks,
      country
    };

    this.userService.updatePerfil(perfilPayload).subscribe({
  next: () => {
    console.log('Perfil actualizado correctamente.');

    this.authService.refreshUser();

      if (newPassword) {
        const passwordPayload = {
          newPassword,
          repeatPassword
        };

        console.log('Payload para cambio de contraseña:', passwordPayload);

        this.userService.changePassword(passwordPayload).subscribe({
          next: () => alert('Perfil y contraseña actualizados correctamente.'),
          error: (err) => {
            console.error('Error al cambiar la contraseña:', err);
            alert('Perfil actualizado, pero ocurrió un error con la contraseña.');
          }
        });
      } else {
        alert('Perfil actualizado correctamente.');
      }
    },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        alert('Ocurrió un error al guardar los cambios del perfil.');
      }
    });
  }

}
