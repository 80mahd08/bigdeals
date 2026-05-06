import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './auth.service';
import { CartService } from './cart.service';
import { Commande, ApiResponse } from '../models';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersSubject = new BehaviorSubject<Commande[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(
    private authService: AuthenticationService,
    private cartService: CartService,
    private http: HttpClient
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadOrders();
      } else {
        this.ordersSubject.next([]);
      }
    });
  }

  private loadOrders(): void {
    this.http.get<ApiResponse<Commande[]>>(`${environment.apiUrl}/orders/me`).subscribe(res => {
      if (res.success && res.data) {
        this.ordersSubject.next(res.data);
      }
    });
  }

  getOrders(): Observable<ApiResponse<Commande[]>> {
    return this.http.get<ApiResponse<Commande[]>>(`${environment.apiUrl}/orders/me`);
  }

  getOrderById(id: number): Observable<ApiResponse<Commande>> {
    return this.http.get<ApiResponse<Commande>>(`${environment.apiUrl}/orders/${id}`);
  }

  checkout(payload: any): Observable<ApiResponse<Commande>> {
    return this.http.post<ApiResponse<Commande>>(`${environment.apiUrl}/orders/checkout`, payload).pipe(
      tap(res => {
        if (res.success) {
          this.loadOrders();
          this.cartService.clearCart();
        }
      })
    );
  }
}
