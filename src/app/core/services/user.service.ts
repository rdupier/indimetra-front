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

  getUserByUsername(username: string): Observable<User | null> {
    return this.http
      .get<{ data: any[] }>(`${this.baseUrl}/buscar/by-username/${username}`)
      .pipe(
        map((res) => {
          if (!res.data.length) return null;
          const raw = res.data[0];
          return {
            username: raw.username,
            email: raw.email,
            profileImage: raw.profileImage,
            socialLinks: raw.socialLinks,
            roles: raw.roles,
          } as User;
        })
      );
  }

}
