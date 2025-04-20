import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { LoginResponse } from '../models/login-response.dto';
import { User } from '../../core/interfaces/user.interface';
import { ApiResponse } from '../../core/models/api-response.dto';
import { RegisterRequestDto } from '../models/register-request.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getRole() {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'http://localhost:8080/auth';

  private _user = signal<User | null>(null);

  public readonly currentUser = computed(() => this._user());
  public readonly isLoggedIn = computed(() => this._user() !== null);
  public readonly isAdmin = computed(() => {
    const user = this._user();
    return Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN');
  });

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromLocalStorage();
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);

            this.getCurrentUser().subscribe({
              next: (res) => {
                const user = res.data;
                // console.log('Usuario autenticado:', user);
                this.setUser(user);

                if (user.roles.includes('ROLE_ADMIN')) {
                  this.router.navigate(['/admin/videos']);
                } else {
                  this.router.navigate(['/']);
                }
              },
              error: () => this.logout(),
            });
          }
        })
      );
  }

  register(data: RegisterRequestDto) {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/register`, data);
  }

  getCurrentUser() {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`);
  }

  setUser(user: User) {
    this._user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.logoutFromBackend().subscribe({
      next: () => {
        this._user.set(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      },
      error: () => {
        this._user.set(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      },
    });
  }

  // Util si en el futuro se quiere guardar sesiones en la bbdd, backlist de JWT, usar cookies en vez de localStorage, etc.
  logoutFromBackend() {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/logout`, {});
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem('user');
    try {
      if (stored && stored !== 'undefined') {
        const parsed = JSON.parse(stored);
        this._user.set(parsed);
      }
    } catch {
      this._user.set(null);
    }
  }

  refreshUser() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.getCurrentUser().subscribe({
      next: (res) => this.setUser(res.data),
      error: () => this.logout(),
    });
  }
}
