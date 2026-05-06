import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DemandeAnnonceur } from '../models';
import { ApiResponse } from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class AdminDemandesAnnonceurService {
  private baseUrl = `${environment.apiUrl}/admin/demandes-annonceur`;

  constructor(private http: HttpClient) { }

  getAllRequests(): Observable<ApiResponse<DemandeAnnonceur[]>> {
    return this.http.get<ApiResponse<DemandeAnnonceur[]>>(this.baseUrl);
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
