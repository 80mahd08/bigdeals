import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AdminDashboardStats {
  totalUsers: number;
  totalAds: number;
  totalRevenue: number;
  pendingAnnouncerRequests: number;
  flaggedAds: number;
  stats: any[];
  recentActivities: any[];
  topSellers: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = `${environment.apiUrl}/admin/dashboard`;

  constructor(private http: HttpClient) { }

  getStats(): Observable<AdminDashboardStats> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      map(response => response.data)
    );
  }
}
