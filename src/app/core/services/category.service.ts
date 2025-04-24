import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CategoryResponseDto } from '../models/category/category-response.dto';
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
}
