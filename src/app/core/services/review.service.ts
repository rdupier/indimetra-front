import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../interfaces/review.interface';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = 'http://localhost:8080/review';

  constructor(private http: HttpClient) {}

  getReviewsByCortometrajeId(id: number): Observable<Review[]> {
    return this.http
      .get<{ data: Review[] }>(`http://localhost:8080/review/buscar/por-cortometraje/${id}`)
      .pipe(map((res) => res.data));
  }


  getAll(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  createReview(review: { cortometrajeId: number; rating: number; comment: string }) {
    return this.http.post<any>('http://localhost:8080/review', review);
  }


}
