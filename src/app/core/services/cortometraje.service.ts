import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cortometraje } from '../interfaces/cortometraje.interface';
import { Review } from '../interfaces/review.interface';
import { ApiResponse } from '../models/api-response.dto';
import { PagedResponse } from '../models/paged-response.dto';

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

  getCortometrajesByAuthor(username: string): Observable<Cortometraje[]> {
    return this.http
      .get<{ data: Cortometraje[] }>(`${this.apiUrl}/buscar/autor/${username}`)
      .pipe(map((res) => res.data));
  }

  getTop5Latest(): Observable<Cortometraje[]> {
    return this.http
      .get<{ data: Cortometraje[] }>(`${this.apiUrl}/buscar/latest`)
      .pipe(map((res) => res.data));
  }

  getMyFavorites(): Observable<any[]> {
    return this.http
      .get<{ data: any[] }>('http://localhost:8080/favorite/mis-favoritos')
      .pipe(map((res) => res.data));
  }

  addToFavorites(cortometrajeId: number): Observable<any> {
    return this.http.post<any>('http://localhost:8080/favorite', {
      cortometrajeId,
    });
  }

  removeFromFavorites(favoriteId: number): Observable<void> {
    return this.http.delete<void>(
      `http://localhost:8080/favorite/${favoriteId}`
    );
  }

  getAllLanguages(): Observable<string[]> {
    return this.http
      .get<ApiResponse<string[]>>(`${this.apiUrl}/buscar/idiomas`)
      .pipe(map((res) => res.data));
  }

  getAllCortometrajesPaginados(
    page: number = 0,
    size: number = 10
  ): Observable<PagedResponse<Cortometraje>> {
    return this.http.get<PagedResponse<Cortometraje>>(
      `${this.apiUrl}/paginated?page=${page}&size=${size}`
    );
  }

  buscarConFiltros(
    genero?: string | null,
    idioma?: string | null,
    duracion?: string | null,
    page: number = 0,
    size: number = 12
  ): Observable<PagedResponse<Cortometraje>> {
    const params: any = {
      page,
      size,
    };

    if (genero) params.genero = genero;
    if (idioma) params.idioma = idioma;
    if (duracion) params.duracion = duracion;

    return this.http.get<PagedResponse<Cortometraje>>(
      `${this.apiUrl}/filtrar`,
      { params }
    );
  }

  createCortometraje(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

}
