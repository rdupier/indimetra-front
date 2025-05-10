import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroSelectComponent } from '../../../shared/components/filtro-select/filtro-select.component';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltroSelectComponent],
  templateUrl: './users-management.component.html',
})
export class UsersManagementComponent implements OnInit {
  usuarios = signal<User[]>([]);
  usuariosFiltrados = signal<User[]>([]);
  filtroUsername = signal<string>('');
  filtroRol = signal<string | null>(null);
  mostrarActivos = signal(true);
  mostrarEliminados = signal(false);
  pagina = signal(0);
  readonly tamanoPagina = 10;

  constructor(private usuarioService: UserService) {
    effect(() => this.buscarPorUsername());
    effect(() => this.aplicarFiltros());
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    const page = this.pagina();
    const size = this.tamanoPagina;
    const activos = this.mostrarActivos();
    const eliminados = this.mostrarEliminados();

    let cargar$;

    if (activos && eliminados) {
      cargar$ = this.usuarioService.getAll();
    } else if (activos) {
      cargar$ = this.usuarioService.getActiveUsersPaginated(page, size);
    } else if (eliminados) {
      cargar$ = this.usuarioService.getDeletedUsersPaginated(page, size);
    } else {
      cargar$ = this.usuarioService.getInactiveUsersPaginated(page, size);
    }

    cargar$.subscribe({
      next: (res) => {
        this.usuarios.set(res);
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  buscarPorUsername(): void {
    const texto = this.filtroUsername().trim();
    if (!texto) {
      this.aplicarFiltros();
      return;
    }

    this.usuarioService.getUserByUsername(texto).subscribe({
      next: (user) => {
        this.usuariosFiltrados.set(user ? [user] : []);
      },
      error: () => this.usuariosFiltrados.set([]),
    });
  }

  aplicarFiltros(): void {
    let filtrados = this.usuarios();
    const username = this.filtroUsername().trim();
    const rol = this.filtroRol();

    if (username) return;

    if (rol) {
      filtrados = filtrados.filter((u) => u.roles === rol);
    }

    this.usuariosFiltrados.set(filtrados);
  }

  resetFiltros(): void {
    this.filtroUsername.set('');
    this.filtroRol.set(null);
    this.mostrarActivos.set(true);
    this.mostrarEliminados.set(false);
    this.cargarUsuarios();
  }

  onActivosChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.mostrarActivos.set(checked);
    if (checked) this.mostrarEliminados.set(false);
    this.cargarUsuarios();
  }

  onEliminadosChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.mostrarEliminados.set(checked);
    if (checked) this.mostrarActivos.set(false);
    this.cargarUsuarios();
  }

  roles(): string[] {
    return [...new Set(this.usuarios().map((u) => u.roles))];
  }

  toggleAdmin(user: User): void {
    const nuevoRol = user.roles === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';

    Swal.fire({
      icon: 'question',
      title: `¿Cambiar el rol de ${user.username} a ${nuevoRol}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A9A59B',
      cancelButtonColor: '#555',
      background: '#2A2929',
      color: '#FFF8F8',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.toggleUserRole(user.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Rol actualizado',
              text: `El rol ha sido cambiado a ${nuevoRol}.`,
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
            this.cargarUsuarios();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo cambiar el rol del usuario.',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
          },
        });
      }
    });
  }

  toggleActivo(user: User): void {
    const texto = user.active ? 'desactivar' : 'reactivar';

    Swal.fire({
      icon: 'question',
      title: `¿Deseas ${texto} al usuario ${user.username}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A9A59B',
      cancelButtonColor: '#555',
      background: '#2A2929',
      color: '#FFF8F8',
    }).then((result) => {
      if (result.isConfirmed) {
        const accion = user.active
          ? this.usuarioService.deactivateUser(user.id)
          : this.usuarioService.reactivateUser(user.id);

        accion.subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Estado actualizado',
              text: `El usuario ha sido ${
                user.active ? 'reactivado' : 'desactivado'
              }.`,
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
            this.cargarUsuarios();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `No se pudo ${texto} al usuario.`,
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
          },
        });
      }
    });
  }

  toggleEliminado(user: User): void {
    if (user.deleted) return;

    Swal.fire({
      icon: 'question',
      title: `¿Eliminar al usuario ${user.username}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#A9A59B',
      cancelButtonColor: '#555',
      background: '#2A2929',
      color: '#FFF8F8',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.softDeleteUser(user.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Usuario eliminado',
              text: 'La eliminación lógica se ha realizado correctamente.',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
            this.cargarUsuarios();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar al usuario.',
              confirmButtonColor: '#A9A59B',
              background: '#2A2929',
              color: '#FFF8F8',
            });
          },
        });
      }
    });
  }
}
