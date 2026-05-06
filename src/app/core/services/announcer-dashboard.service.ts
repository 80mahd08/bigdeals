import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './auth.service';
import { Annonce, ApiResponse } from '../models';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnouncerDashboardService {

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient
  ) {}

  getMyAnnouncements(keyword?: string): Observable<Annonce[]> {
    let url = `${environment.apiUrl}/users/me/annonces`;
    if (keyword) {
      url += `?keyword=${encodeURIComponent(keyword)}`;
    }
    return this.http.get<ApiResponse<any>>(url).pipe(
      map(res => {
          if (res.success && res.data && res.data.items) {
              return res.data.items;
          }
          return [];
      })
    );
  }

  getAnnouncementById(id: number | string): Observable<ApiResponse<Annonce>> {
    return this.http.get<ApiResponse<Annonce>>(`${environment.apiUrl}/users/me/annonces/${id}`);
  }

  createAnnouncement(payload: FormData | any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/annonces`, payload);
  }

  updateAnnouncement(id: number | string, payload: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${environment.apiUrl}/annonces/${id}`, payload);
  }

  deleteAnnouncement(id: number | string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${environment.apiUrl}/annonces/${id}`);
  }

  suspendAnnouncement(id: number | string): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${environment.apiUrl}/annonces/${id}/suspend`, {});
  }

  resumeAnnouncement(id: number | string): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${environment.apiUrl}/annonces/${id}/resume`, {});
  }

  getDashboardStats(): Observable<any> {
    return this.getMyAnnouncements().pipe(
      map(ads => {
        const active = ads.filter(a => a.statut === 'PUBLIEE').length;
        const total = ads.length;
        return [
          { label: 'Annonces Totales', value: total, icon: 'ri-stack-line', color: 'primary' },
          { label: 'Annonces Actives', value: active, icon: 'ri-checkbox-circle-line', color: 'success' },
          { label: 'Commandes Reçues', value: 0, icon: 'ri-shopping-bag-line', color: 'info' }
        ];
      })
    );
  }

  getAnnouncerOrders(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/annonceurs/me/orders`).pipe(
        map(res => res.data || [])
    );
  }

  getAnnouncerReviews(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/annonceurs/me/reviews`).pipe(
        map(res => res.data || []),
        catchError((err) => {
          console.error('Error in getAnnouncerReviews:', err);
          return of([]);
        })
    );
  }
}
