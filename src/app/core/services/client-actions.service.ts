import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './auth.service';
import { Signalement, ContactAnnonceur, DemandeAnnonceur } from '../models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class ClientActionsService {
  constructor(
    private authService: AuthenticationService,
    private http: HttpClient
  ) {}

  // --- REVIEWS (AVIS) ---
  getAvis(idAnnonce: number, page: number = 1, pageSize: number = 5): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrl}/annonces/${idAnnonce}/avis?page=${page}&pageSize=${pageSize}`);
  }

  createAvis(idAnnonce: number, note: number, commentaire: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/annonces/${idAnnonce}/avis`, { note, commentaire });
  }

  updateAvis(idAnnonce: number, note: number, commentaire: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${environment.apiUrl}/annonces/${idAnnonce}/avis/me`, { note, commentaire });
  }

  deleteAvis(idAnnonce: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${environment.apiUrl}/annonces/${idAnnonce}/avis/me`);
  }

  // --- REPORTS (SIGNALEMENTS) ---
  submitReport(signalement: Partial<Signalement>): Observable<ApiResponse<Signalement>> {
    return this.http.post<ApiResponse<Signalement>>(`${environment.apiUrl}/interactions/report`, signalement);
  }

  // --- CONTACT TRACKING ---
  logContactEvent(idAnnonce: number, type: 'WHATSAPP' | 'PHONE'): Observable<ApiResponse<boolean>> {
    const payload = {
        idAnnonce,
        typeContact: type === 'PHONE' ? 1 : 2
    };
    return this.http.post<ApiResponse<boolean>>(`${environment.apiUrl}/interactions/contact`, payload);
  }


  // --- ADVERTISER REQUEST (DEMANDE ANNONCEUR) ---
  submitAdvertiserRequest(file: File): Observable<ApiResponse<DemandeAnnonceur>> {
    const formData = new FormData();
    formData.append('Document', file);
    return this.http.post<ApiResponse<DemandeAnnonceur>>(`${environment.apiUrl}/demandes-annonceur`, formData);
  }

  getAdvertiserRequests(): Observable<ApiResponse<DemandeAnnonceur[]>> {
    return this.http.get<ApiResponse<DemandeAnnonceur[]>>(`${environment.apiUrl}/demandes-annonceur/me`);
  }

  getMyLatestAdvertiserDocument(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/demandes-annonceur/me/document`, { responseType: 'blob' });
  }

  initiatePayment(demandeAnnonceurId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/annonceur-payments/initiate/${demandeAnnonceurId}`, {});
  }

}
