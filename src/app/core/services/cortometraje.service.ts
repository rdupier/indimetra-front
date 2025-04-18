import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // cuando tenga el endpoint:
  // getCortometrajesByAuthor(author: string): Observable<Cortometraje[]> {
  //   return this.http.get<Cortometraje[]>(`http://localhost:8080/cortometraje/autor/${author}`);
  // }

}
