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
    return this.http.get<Review[]>('http://localhost:8080/review').pipe(
      map((reviews) => reviews.filter(r => r.cortometrajeId === id))
    );
  }

  getAll(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }
}
