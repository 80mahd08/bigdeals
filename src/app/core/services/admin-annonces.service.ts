import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class AdminAnnoncesService {
  private apiUrl = `${environment.apiUrl}/admin/annonces`;

  constructor(private http: HttpClient) { }

  getAnnonces(pageNumber: number = 1, pageSize: number = 12, search?: string): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    
    return this.http.get<ApiResponse<any>>(this.apiUrl, { params });
  }

  suspendAnnonce(id: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}/suspend`, {});
  }

  restoreAnnonce(id: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}/restore`, {});
  }
}
