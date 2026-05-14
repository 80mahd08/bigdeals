import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../core/services/orders.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcer-orders',
  templateUrl: './announcer-orders.component.html',
  styleUrls: ['./announcer-orders.component.scss'],
  standalone: false
})
export class AnnouncerOrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.ordersService.getAnnouncerOrders().subscribe({
      next: (res) => {
        // Some debugging: if you see "Inconnu", it might be a naming or enum serialization issue
        this.orders = res || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get totalRevenue(): number {
    return this.orders
      .filter(o => this.isPaid(o))
      .reduce((sum, o) => sum + (o.montant || 0), 0);
  }

  private isPaid(order: any): boolean {
    const s = String(order.statutCommande);
    return s === '2' || s === 'PAYEE';
  }

  // ─── Payment status helpers ────────────────────
  getStatusLabel(status: any): string {
    const s = String(status);
    switch (s) {
      case '1': case 'EN_ATTENTE_PAIEMENT': return 'En attente';
      case '2': case 'PAYEE': return 'Payée';
      case '3': case 'ANNULEE': return 'Annulée';
      default: return s;
    }
  }

  getStatusBadgeClass(status: any): string {
    const s = String(status);
    if (s === '2' || s === 'PAYEE') return 'bg-success-subtle text-success';
    if (s === '1' || s === 'EN_ATTENTE_PAIEMENT') return 'bg-warning-subtle text-warning';
    if (s === '3' || s === 'ANNULEE') return 'bg-danger-subtle text-danger';
    return 'bg-info-subtle text-info';
  }

  // ─── Delivery status helpers ───────────────────
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

  private normalizeStatus(status: any): number {
    if (status === null || status === undefined) return 0;
    if (typeof status === 'number') return status;
    
    // Handle string names if serialized as strings
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

  // ─── Valid next transitions ────────────────────
  getNextTransitions(status: any): { value: number; label: string }[] {
    const s = this.normalizeStatus(status);
    const map: Record<number, { value: number; label: string }[]> = {
      1: [
        { value: 2, label: 'Passer en préparation' },
        { value: 7, label: 'Annuler la livraison' }
      ],
      2: [
        { value: 3, label: 'Marquer comme expédiée' },
        { value: 7, label: 'Annuler la livraison' }
      ],
      3: [
        { value: 4, label: 'Marquer comme livrée' },
        { value: 5, label: 'Signaler échec livraison' }
      ],
      5: [
        { value: 6, label: 'Marquer comme retournée' },
        { value: 3, label: 'Réexpédier' }
      ]
    };
    return map[s] || [];
  }

  updateDeliveryStatus(order: any, newStatus: number): void {
    if (!this.isPaid(order)) {
      Swal.fire('Action impossible', 'La commande doit être payée.', 'warning');
      return;
    }

    this.ordersService.updateAnnouncerDeliveryStatus(order.idCommande, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire({ icon: 'success', title: 'Mis à jour', text: res.message, timer: 1500, showConfirmButton: false });
          this.loadOrders();
        } else {
          Swal.fire('Erreur', res.message || 'Transition invalide.', 'error');
        }
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de mettre à jour le statut.', 'error');
      }
    });
  }
}
