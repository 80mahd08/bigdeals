import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AdminGrowthPoint {
  label: string;
  date?: string | null;
  value: number;
}

export interface AdminGrowthChart {
  metric: string;
  period: string;
  title: string;
  points: AdminGrowthPoint[];
}

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

  getDashboardGrowth(metric: 'users' | 'annonces' | 'revenue' | 'signalements', period: '7d' | '30d' | '12m'): Observable<AdminGrowthChart> {
    return this.http.get<any>(`${this.apiUrl}/growth?metric=${metric}&period=${period}`).pipe(
      map(response => response.data)
    );
  }
}
