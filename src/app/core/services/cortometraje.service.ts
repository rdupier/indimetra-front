import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cortometraje } from '../interfaces/cortometraje.interface';
import { Review } from '../interfaces/review.interface';

@Injectable({
  providedIn: 'root',
})
export class CortometrajeService {
  private readonly apiUrl = 'http://localhost:8080/cortometraje';

  constructor(private http: HttpClient) {}

  getAllCortometrajes(): Observable<Cortometraje[]> {
    return this.http.get<Cortometraje[]>(this.apiUrl);
  }

  getCortometrajeById(id: number): Observable<Cortometraje> {
    return this.http.get<Cortometraje>(`${this.apiUrl}/${id}`);
  }

  getReviewByCortometrajeId(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${id}/reviews`);
  }

  getMyFavorites(): Observable<any[]> {
    return this.http
      .get<{ data: any[] }>('http://localhost:8080/favorite/mis-favoritos')
      .pipe(map((res) => res.data));
  }

  addToFavorites(cortometrajeId: number) {
    return this.http.post<any>('http://localhost:8080/favorite', { cortometrajeId });
  }

  removeFromFavorites(favoriteId: number) {
    return this.http.delete(`http://localhost:8080/favorite/${favoriteId}`);
  }
}
