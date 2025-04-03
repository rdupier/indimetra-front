import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { User } from '../interfaces/user.interface';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  private _user = signal<User | null>(null);

  public readonly currentUser = computed(() => this._user());
  public readonly isLoggedIn = computed(() => this._user() !== null);
  public readonly isAdmin = computed(() => {
    const user = this._user();
    return Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN');
  });

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        console.log('LOGIN RESPONSE:', response);

        // Guarda el token
        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        const user = {
          username: response.username,
          roles: ['ROLE_USER'],
          email: '',
          profileImage: '',
        };

        this.setUser(user);
      })

    );
  }

  setUser(user: User) {
    this._user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem('user');
    try {
      if (stored && stored !== 'undefined') {
        const parsed = JSON.parse(stored);
        this._user.set(parsed);
      }
    } catch (err) {
      console.error('Error al cargar el usuario desde localStorage:', err);
      this._user.set(null);
    }
  }
}

