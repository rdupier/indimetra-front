import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CategoryResponseDto } from '../models/category/category-response.dto';
import { CategoryRequestDto } from '../models/category/category-request.dto';
import { ApiResponse } from '../models/api-response.dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8080/category';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<CategoryResponseDto[]> {
    return this.http
      .get<ApiResponse<CategoryResponseDto[]>>(this.apiUrl)
      .pipe(map((res) => res.data));
  }

  getCategoryById(id: number): Observable<CategoryResponseDto> {
    return this.http
      .get<ApiResponse<CategoryResponseDto>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createCategory(dto: CategoryRequestDto): Observable<CategoryResponseDto> {
    return this.http
      .post<ApiResponse<CategoryResponseDto>>(this.apiUrl, dto)
      .pipe(map((res) => res.data));
  }

  updateCategory(
    id: number,
    dto: CategoryRequestDto
  ): Observable<CategoryResponseDto> {
    return this.http
      .put<ApiResponse<CategoryResponseDto>>(`${this.apiUrl}/${id}`, dto)
      .pipe(map((res) => res.data));
  }

  deleteCategory(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }
}
