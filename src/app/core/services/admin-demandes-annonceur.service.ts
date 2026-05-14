import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DemandeAnnonceur } from '../models';
import { ApiResponse, PagedResponse } from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class AdminDemandesAnnonceurService {
  private baseUrl = `${environment.apiUrl}/admin/demandes-annonceur`;

  constructor(private http: HttpClient) { }

  getAllRequests(pageNumber: number = 1, pageSize: number = 10, statut?: number, search?: string): Observable<ApiResponse<PagedResponse<DemandeAnnonceur>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (statut !== undefined && statut !== null) {
      params = params.set('statut', statut.toString());
    }
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<PagedResponse<DemandeAnnonceur>>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<DemandeAnnonceur>> {
    return this.http.get<ApiResponse<DemandeAnnonceur>>(`${this.baseUrl}/${id}`);
  }

  approveRequest(id: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${id}/approve`, {});
  }

  rejectRequest(id: number, motifRejet: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${id}/reject`, { motifRejet });
  }

  getDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/document`, { responseType: 'blob' });
  }
}
