import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cortometraje } from '../interfaces/cortometraje.interface';
import { Review } from '../interfaces/review.interface';
import { ApiResponse } from '../models/api-response.dto';
import { PagedResponse } from '../models/paged-response.dto';

/**
 * Servicio para gestionar cortometrajes y sus operaciones asociadas,
 * incluyendo búsqueda, favoritos y reseñas.
 */
@Injectable({
  providedIn: 'root',
})
export class CortometrajeService {
  private readonly apiUrl = 'http://localhost:8080/cortometraje';
  private readonly favoritosUrl = 'http://localhost:8080/favorite';

  constructor(private http: HttpClient) {}

  // --------------------------------------------------------------------------
  // BÁSICO - CRUD
  // --------------------------------------------------------------------------

  /**
   * Obtiene todos los cortometrajes sin paginar.
   * @returns Observable con un array de cortometrajes.
   */
  getAllCortometrajes(): Observable<Cortometraje[]> {
    return this.http.get<Cortometraje[]>(this.apiUrl);
  }

  /**
   * Obtiene un cortometraje por su ID.
   * @param id ID del cortometraje.
   * @returns Observable con el cortometraje correspondiente.
   */
  getCortometrajeById(id: number): Observable<Cortometraje> {
    return this.http.get<Cortometraje>(`${this.apiUrl}/${id}`);
  }

  /**
   * Elimina un cortometraje si el usuario es el dueño o admin.
   * @param id ID del cortometraje a eliminar.
   * @returns Observable con el mensaje de éxito.
   */
  eliminarCortometraje(id: number): Observable<string> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.message));
  }

  /**
   * Crea un nuevo cortometraje.
   * @param data Datos del cortometraje.
   * @returns Observable con la respuesta del backend.
   */
  createCortometraje(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  /**
 * Actualiza un cortometraje existente.
 * @param id ID del cortometraje a actualizar.
 * @param data Datos actualizados del cortometraje.
 * @returns Observable con el cortometraje actualizado.
 */
  updateCortometraje(id: number, data: Partial<Cortometraje>): Observable<Cortometraje> {
    return this.http.put<Cortometraje>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Elimina un cortometraje (versión directa).
   * @param id ID del cortometraje.
   * @returns Observable void.
   */
  deleteCortometraje(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // --------------------------------------------------------------------------
  // BÚSQUEDAS Y FILTROS
  // --------------------------------------------------------------------------

  /**
   * Obtiene todos los cortometrajes paginados.
   * @param page Número de página (por defecto 0).
   * @param size Tamaño de página (por defecto 10).
   * @returns Observable con los cortometrajes paginados.
   */
  getAllCortometrajesPaginados(
    page: number = 0,
    size: number = 10
  ): Observable<PagedResponse<Cortometraje>> {
    return this.http.get<PagedResponse<Cortometraje>>(
      `${this.apiUrl}/paginated?page=${page}&size=${size}`
    );
  }

  /**
   * Busca cortometrajes filtrando por género, idioma o duración.
   * @param genero Género del cortometraje (opcional).
   * @param idioma Idioma del cortometraje (opcional).
   * @param duracion Rango de duración (opcional).
   * @param page Página actual (por defecto 0).
   * @param size Tamaño de página (por defecto 12).
   * @returns Observable con cortometrajes filtrados y paginados.
   */
  buscarConFiltros(
    genero?: string | null,
    idioma?: string | null,
    duracion?: string | null,
    page: number = 0,
    size: number = 12
  ): Observable<PagedResponse<Cortometraje>> {
    const params: any = { page, size };
    if (genero) params.genero = genero;
    if (idioma) params.idioma = idioma;
    if (duracion) params.duracion = duracion;

    return this.http.get<PagedResponse<Cortometraje>>(
      `${this.apiUrl}/filtrar`,
      { params }
    );
  }

  /**
   * Obtiene los cortometrajes publicados por un autor específico.
   * @param username Nombre de usuario del autor.
   * @returns Observable con un array de cortometrajes.
   */
  getCortometrajesByAuthor(username: string): Observable<Cortometraje[]> {
    return this.http
      .get<{ data: Cortometraje[] }>(`${this.apiUrl}/buscar/autor/${username}`)
      .pipe(map((res) => res.data));
  }

  /**
   * Obtiene los cortometrajes publicados por categoria.
   * @param nombre Nombre de la categoria.
   * @returns Observable con un array de cortometrajes.
   */
  getCortometrajesByCategory(nombre: string): Observable<Cortometraje[]> {
    return this.http
      .get<{ data: Cortometraje[] }>(`${this.apiUrl}/buscar/categoria/${nombre}`)
      .pipe(map((res) => res.data));
  }

  /**
   * Obtiene los 5 cortometrajes más recientes.
   * @returns Observable con un array de cortometrajes.
   */
  getTop5Latest(): Observable<Cortometraje[]> {
    return this.http
      .get<{ data: Cortometraje[] }>(`${this.apiUrl}/buscar/latest`)
      .pipe(map((res) => res.data));
  }

  /**
   * Obtiene la lista de idiomas disponibles en los cortometrajes.
   * @returns Observable con un array de strings (idiomas).
   */
  getAllLanguages(): Observable<string[]> {
    return this.http
      .get<ApiResponse<string[]>>(`${this.apiUrl}/buscar/idiomas`)
      .pipe(map((res) => res.data));
  }

  // --------------------------------------------------------------------------
  // FAVORITOS
  // --------------------------------------------------------------------------

  /**
   * Obtiene los cortometrajes marcados como favoritos por el usuario autenticado.
   * @returns Observable con un array de favoritos.
   */
  getMyFavorites(): Observable<any[]> {
    return this.http
      .get<{ data: any[] }>(`${this.favoritosUrl}/mis-favoritos`)
      .pipe(map((res) => res.data));
  }

  /**
   * Añade un cortometraje a favoritos.
   * @param cortometrajeId ID del cortometraje a añadir.
   * @returns Observable con la respuesta del backend.
   */
  addToFavorites(cortometrajeId: number): Observable<any> {
    return this.http.post<any>(this.favoritosUrl, { cortometrajeId });
  }

  /**
   * Elimina un cortometraje de favoritos.
   * @param favoriteId ID del favorito a eliminar.
   * @returns Observable void al eliminar con éxito.
   */
  removeFromFavorites(favoriteId: number): Observable<void> {
    return this.http.delete<void>(`${this.favoritosUrl}/${favoriteId}`);
  }

  // --------------------------------------------------------------------------
  // RELACIONES
  // --------------------------------------------------------------------------

  /**
   * Obtiene las reseñas asociadas a un cortometraje.
   * @param id ID del cortometraje.
   * @returns Observable con un array de reseñas.
   */
  getReviewByCortometrajeId(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${id}/reviews`);
  }
}
