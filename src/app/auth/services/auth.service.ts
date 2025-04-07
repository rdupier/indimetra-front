import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { LoginResponseDto } from '../models/login-response.dto';
import { LoginRequestDto } from '../models/login-request.dto';

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
    this.loadFromToken();
  }

  login(data: LoginRequestDto) {
    return this.http.post<LoginResponseDto>(`${this.baseUrl}/login`, data).pipe(
      tap((response) => {
        console.log('LOGIN RESPONSE:', response);

        const token = response.token;
        localStorage.setItem('token', token);

        // Realizamos llamada a /auth/me para obtener el usuario completo
        this.getProfile().subscribe({
          next: (user) => {
            console.log('Usuario completo desde /me:', user);
            this.setUser(user);
          },
          error: (err) => {
            console.error('Error al recuperar perfil:', err);
          },
        });
      })
    );
  }

  getProfile() {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap((user) => {
        this.setUser(user);
      })
    );
  }

  private buildUserFromToken(token: string): User | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      const authorities = JSON.parse(payload.authorities);
      const roles = authorities.map((auth: any) => auth.authority);

      return {
        username: payload.username || payload.sub,
        email: '',
        profileImage: '',
        roles: roles,
      };
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }

  private loadFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.buildUserFromToken(token);
      if (user) {
        this.setUser(user);
        this.getProfile().subscribe();
      }
    }
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
}
