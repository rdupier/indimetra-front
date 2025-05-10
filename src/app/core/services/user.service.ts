import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http
      .get<{ data: any[] }>(`${this.baseUrl}`)
      .pipe(map((res) => res.data.map((raw) => this.mapToUser(raw))));
  }

  updatePerfil(data: Partial<User> & { newPassword?: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/me`, data);
  }

  changePassword(data: { newPassword: string; repeatPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/me/change-password`, data);
  }

  getUserByUsername(username: string): Observable<User | null> {
    return this.http
      .get<{ data: any[] }>(`${this.baseUrl}/buscar/by-username/${username}`)
      .pipe(
        map((res) => {
          if (!res.data.length) return null;
          return this.mapToUser(res.data[0]);
        })
      );
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http
      .get<{ data: any[] }>(`${this.baseUrl}/buscar/by-role/${role}`)
      .pipe(map((res) => res.data.map((raw) => this.mapToUser(raw))));
  }

  toggleUserRole(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/toggle-role/${id}`, {});
  }

  deactivateUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/deactivate/${id}`, {});
  }

  reactivateUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/reactivate/${id}`, {});
  }

  softDeleteUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/soft-delete/${id}`, {});
  }

  getActiveUsersPaginated(
    page: number = 0,
    size: number = 10
  ): Observable<User[]> {
    return this.http
      .get<{ data: { data: any[] } }>(
        `${this.baseUrl}/paginated/active?page=${page}&size=${size}`
      )
      .pipe(map((res) => res.data.data.map((raw) => this.mapToUser(raw))));
  }

  getInactiveUsersPaginated(
    page: number = 0,
    size: number = 10
  ): Observable<User[]> {
    return this.http
      .get<{ data: { data: any[] } }>(
        `${this.baseUrl}/paginated/inactive?page=${page}&size=${size}`
      )
      .pipe(map((res) => res.data.data.map((raw) => this.mapToUser(raw))));
  }

  getDeletedUsersPaginated(
    page: number = 0,
    size: number = 10
  ): Observable<User[]> {
    return this.http
      .get<{ data: { data: any[] } }>(
        `${this.baseUrl}/paginated/deleted?page=${page}&size=${size}`
      )
      .pipe(map((res) => res.data.data.map((raw) => this.mapToUser(raw))));
  }

  private mapToUser(raw: any): User {
    return {
      id: raw.id,
      username: raw.username,
      email: raw.email,
      profileImage: raw.profileImage,
      socialLinks: raw.socialLinks,
      country: raw.country,
      roles: raw.roles[0],
      active: raw.isActive,
      deleted: raw.isDeleted,
      autor: raw.isAuthor,
    };
  }
}
