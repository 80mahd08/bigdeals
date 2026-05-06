import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categorie, CategorieSchema, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<ApiResponse<Categorie[]>> {
    return this.http.get<ApiResponse<Categorie[]>>(`${environment.apiUrl}/categories`);
  }

  getCategorySchema(id: number): Observable<ApiResponse<CategorieSchema>> {
    return this.http.get<ApiResponse<CategorieSchema>>(`${environment.apiUrl}/categories/${id}/schema`);
  }
}
