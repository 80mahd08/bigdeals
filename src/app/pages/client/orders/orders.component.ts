import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/core/services/orders.service';
import { Commande } from 'src/app/core/models/commande.model';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { StatutCommande } from '../../../core/enums';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: false
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;
  statutCommande = StatutCommande;
  expandedOrderId: number | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  cancelOrder(orderId: number): void {
    Swal.fire({
      title: 'Annuler la commande ?',
      text: "Voulez-vous vraiment annuler cette commande ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Retour'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.ordersService.cancelOrder(orderId).subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire('Annulée', res.message, 'success');
              this.loadOrders();
            } else {
              Swal.fire('Erreur', res.message, 'error');
            }
          },
          error: () => {
            Swal.fire('Erreur', 'Impossible d\'annuler la commande.', 'error');
          }
        });
      }
    });
  }

  toggleDetails(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  // ─── Payment status ───────────────────────────
  getStatusLabel(status: any): string {
    const s = String(status);
    switch (s) {
      case '1': return 'En attente';
      case '2': return 'Payée';
      case '3': return 'Annulée';
      default: return s;
    }
  }

  getStatusBadgeClass(status: any): string {
    const s = String(status);
    if (s === '2') return 'bg-success-subtle text-success';
    if (s === '1') return 'bg-warning-subtle text-warning';
    if (s === '3') return 'bg-danger-subtle text-danger';
    return 'bg-info-subtle text-info';
  }

  // ─── Delivery status ──────────────────────────
  getDeliveryLabel(status: any): string {
    const s = this.normalizeStatus(status);
    switch (s) {
      case 1: return 'En attente de préparation';
      case 2: return 'En préparation';
      case 3: return 'Expédiée';
      case 4: return 'Livrée';
      case 5: return 'Échec de livraison';
      case 6: return 'Retournée';
      case 7: return 'Annulée';
      default: return 'Inconnu (' + status + ')';
    }
  }

  getDeliveryBadgeClass(status: any): string {
    const s = this.normalizeStatus(status);
    switch (s) {
      case 1: return 'bg-secondary-subtle text-secondary';
      case 2: return 'bg-info-subtle text-info';
      case 3: return 'bg-primary-subtle text-primary';
      case 4: return 'bg-success-subtle text-success';
      case 5: return 'bg-danger-subtle text-danger';
      case 6: return 'bg-warning-subtle text-warning';
      case 7: return 'bg-danger-subtle text-danger';
      default: return 'bg-light text-dark';
    }
  }

  public normalizeStatus(status: any): number {
    if (status === null || status === undefined) return 0;
    if (typeof status === 'number') return status;
    const s = String(status);
    switch (s) {
      case '1': case 'EN_ATTENTE_PREPARATION': return 1;
      case '2': case 'EN_PREPARATION': return 2;
      case '3': case 'EXPEDIEE': return 3;
      case '4': case 'LIVREE': return 4;
      case '5': case 'ECHEC_LIVRAISON': return 5;
      case '6': case 'RETOURNEE': return 6;
      case '7': case 'ANNULEE': return 7;
      default: return 0;
    }
  }

  // ─── Timeline steps (happy path) ──────────────
  getTimelineSteps(): { label: string; status: number }[] {
    return [
      { label: 'En attente', status: 1 },
      { label: 'En préparation', status: 2 },
      { label: 'Expédiée', status: 3 },
      { label: 'Livrée', status: 4 }
    ];
  }

  getTimelineState(orderStatus: any, stepStatus: number): string {
    const current = this.normalizeStatus(orderStatus);
    if (current >= 5) {
      if (stepStatus <= 3) return 'completed';
      return 'pending';
    }
    if (stepStatus < current) return 'completed';
    if (stepStatus === current) return 'active';
    return 'pending';
  }
}
