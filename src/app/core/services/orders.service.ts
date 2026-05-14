import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Commande } from '../models';
import { environment } from 'src/environments/environment';
import { MethodePaiement } from '../enums';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient, private cartService: CartService) {}

  getOrders(): Observable<Commande[]> {
    return this.http.get<any>(this.apiUrl).pipe(map(res => res.data));
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/client/${orderId}/cancel`, {});
  }

  getOrderById(id: number): Observable<Commande> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(res => res.data));
  }

  getAnnouncerOrders(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/announcer`).pipe(map(res => res.data));
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/admin/all`).pipe(map(res => res.data));
  }

  checkout(methode: MethodePaiement, deliveryAddress?: { adresse: string; ville: string; telephone: string; notes?: string }): Observable<Commande> {
    const cart = (this.cartService as any).cartSubject.value;
    const body: any = {
      methodePaiement: methode,
      lignes: cart.lignes.map((l: any) => ({
        idAnnonce: l.idAnnonce,
        quantite: l.quantite
      }))
    };

    if (deliveryAddress) {
      body.adresseLivraison = deliveryAddress.adresse;
      body.villeLivraison = deliveryAddress.ville;
      body.telephoneLivraison = deliveryAddress.telephone;

    }

    return this.http.post<any>(this.apiUrl, body).pipe(map(res => res.data));
  }

  updateAnnouncerDeliveryStatus(orderId: number, statutLivraison: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/announcer/${orderId}/delivery-status`, {
      statutLivraison
    });
  }

  updateAdminDeliveryStatus(orderId: number, statutLivraison: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/${orderId}/delivery-status`, {
      statutLivraison
    });
  }
}
