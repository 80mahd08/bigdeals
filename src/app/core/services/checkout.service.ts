import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/Checkout`;
  private paymentUrl = `${environment.apiUrl}/ProductPayments`;

  constructor(private http: HttpClient) {}

  createCheckout(idAnnonce: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/${idAnnonce}`, {}).pipe(map(res => res.data));
  }

  getCheckout(idCommande: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idCommande}`).pipe(map(res => res.data));
  }

  processMockPayment(request: any): Observable<any> {
    return this.http.post<any>(`${this.paymentUrl}/mock-process`, request).pipe(map(res => res.data));
  }
}
