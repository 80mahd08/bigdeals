import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur, Annonce, ApiResponse } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilisateursService {
  constructor(private http: HttpClient) {}

  getUtilisateurById(id: number): Observable<ApiResponse<Utilisateur>> {
    return this.http.get<ApiResponse<Utilisateur>>(`${environment.apiUrl}/users/${id}`);
  }

  getProfilPublic(id: number): Observable<ApiResponse<{ user: Utilisateur, ads: Annonce[] }>> {
    return this.http.get<ApiResponse<{ user: Utilisateur, ads: Annonce[] }>>(`${environment.apiUrl}/users/${id}/profile`);
  }
}
