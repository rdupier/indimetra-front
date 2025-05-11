import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../interfaces/review.interface';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly apiUrl = 'http://localhost:8080/review';

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<Review[]> {
    return this.http
      .get<{ data: Review[] }>(`${this.apiUrl}`)
      .pipe(map((res) => res.data));
  }

  getReviewsByCortometrajeId(id: number): Observable<Review[]> {
    return this.http
      .get<{ data: Review[] }>(`${this.apiUrl}/buscar/por-cortometraje/${id}`)
      .pipe(map((res) => res.data));
  }

  createReview(review: {
    cortometrajeId: number;
    rating: number;
    comment: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, review)
      .pipe(map((res) => res.data));
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFiltrosDesdeReviews(): Observable<{
    usuarios: string[];
    peliculas: string[];
  }> {
    return this.getAllReviews().pipe(
      map((reviews) => {
        const usuarios = [...new Set(reviews.map((r) => r.username))];
        const peliculas = [...new Set(reviews.map((r) => r.cortometrajeTitle))];
        return { usuarios, peliculas };
      })
    );
  }
}
