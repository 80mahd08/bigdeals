import { Component, OnInit } from '@angular/core';
import { AnnouncerDashboardService } from '../../../core/services/announcer-dashboard.service';
import { OrdersService } from '../../../core/services/orders.service';
import { Annonce } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  stats: any[] = [];
  recentAds: Annonce[] = [];
  recentOrders: any[] = [];
  isLoading = true;

  constructor(
    private announcerService: AnnouncerDashboardService,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.announcerService.getDashboardStats().subscribe((res: any) => {
      this.stats = res;

      // Fetch orders to add sales stats
      this.ordersService.getAnnouncerOrders().subscribe({
        next: (orders: any[]) => {
          const totalSales = orders.length;
          const totalRevenue = orders
            .filter((o: any) => String(o.statutCommande) === '2')
            .reduce((sum: number, o: any) => sum + (o.montant || 0), 0);

          this.stats.push(
            { label: 'Total Ventes', value: totalSales, icon: 'ri-shopping-bag-3-line', color: 'info' },
            { label: 'Revenus', value: Math.round(totalRevenue) + ' TND', icon: 'ri-money-dollar-circle-line', color: 'warning' }
          );

          this.recentOrders = orders.slice(0, 5);
        },
        error: () => {}
      });

      this.announcerService.getMyAnnouncements().subscribe((ads: Annonce[]) => {
        this.recentAds = ads.slice(0, 5);
        this.isLoading = false;
      });
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PUBLIEE': return 'badge bg-success-subtle text-success';
      case 'SUSPENDUE': return 'badge bg-warning-subtle text-warning';
      default: return 'badge bg-light text-dark';
    }
  }

  getOrderStatusLabel(status: any): string {
    const s = String(status);
    switch (s) {
      case '1': return 'En attente';
      case '2': return 'Payée';
      case '3': return 'Annulée';
      default: return s;
    }
  }

  getOrderStatusBadgeClass(status: any): string {
    const s = String(status);
    if (s === '2') return 'badge bg-success-subtle text-success';
    if (s === '1') return 'badge bg-warning-subtle text-warning';
    if (s === '3') return 'badge bg-danger-subtle text-danger';
    return 'badge bg-info-subtle text-info';
  }

  getDeliveryLabel(status: any): string {
    const s = String(status);
    switch (s) {
      case '1': return 'En attente';
      case '2': return 'En prép.';
      case '3': return 'Expédiée';
      case '4': return 'Livrée';
      case '5': return 'Échec';
      case '6': return 'Retournée';
      case '7': return 'Annulée';
      default: return '—';
    }
  }

  getDeliveryBadgeClass(status: any): string {
    const s = String(status);
    switch (s) {
      case '4': return 'badge bg-success-subtle text-success';
      case '3': return 'badge bg-primary-subtle text-primary';
      case '2': return 'badge bg-info-subtle text-info';
      case '5': case '7': return 'badge bg-danger-subtle text-danger';
      default: return 'badge bg-secondary-subtle text-secondary';
    }
  }
}


