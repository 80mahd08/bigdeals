import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class AdminPaymentsService {
  private apiUrl = `${environment.apiUrl}/admin/annonceur-payments`;

  constructor(private http: HttpClient) { }

  getAllPayments(page: number = 1, pageSize: number = 10, search?: string): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    
    return this.http.get<ApiResponse<any>>(this.apiUrl, { params });
  }

  markAsPaid(paymentId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${paymentId}/mock-mark-paid`, {});
  }
}
