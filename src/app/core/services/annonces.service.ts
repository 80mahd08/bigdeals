import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Annonce, ApiResponse, PagedResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AnnoncesService {
  constructor(private http: HttpClient) {}

  getAnnonces(
    keyword?: string,
    idCategorie?: number,
    prixMin?: number,
    prixMax?: number,
    localisation?: string,
    pageNumber: number = 1,
    pageSize: number = 9,
    filtresDynamiques?: any[],
    sortBy?: string,
    sortDirection?: string
  ): Observable<ApiResponse<PagedResponse<Annonce>>> {
    const body = {
      keyword,
      idCategorie,
      prixMin,
      prixMax,
      localisation,
      pageNumber,
      pageSize,
      filtresDynamiques: filtresDynamiques || [],
      sortBy,
      sortDirection
    };

    return this.http.post<ApiResponse<PagedResponse<Annonce>>>(`${environment.apiUrl}/annonces/search`, body);
  }

  getAnnonceById(id: number): Observable<ApiResponse<Annonce>> {
    return this.http.get<ApiResponse<Annonce>>(`${environment.apiUrl}/annonces/${id}`);
  }

  getAnnoncesByUtilisateur(idUtilisateur: number): Observable<ApiResponse<Annonce[]>> {
    return this.http.get<ApiResponse<Annonce[]>>(`${environment.apiUrl}/annonces/user/${idUtilisateur}`);
  }

  // Announcer / My Ads
  getMyAnnonces(pageNumber: number = 1, pageSize: number = 12): Observable<ApiResponse<PagedResponse<Annonce>>> {
    return this.http.get<ApiResponse<PagedResponse<Annonce>>>(`${environment.apiUrl}/users/me/annonces?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  createAnnonce(formData: FormData): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${environment.apiUrl}/annonces`, formData);
  }

  updateAnnonce(id: number, data: any): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}/annonces/${id}`, data);
  }

  deleteAnnonce(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${environment.apiUrl}/annonces/${id}`);
  }
}
