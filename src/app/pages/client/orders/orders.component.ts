import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../core/services/orders.service';
import { Commande } from '../../../core/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: false
})
export class OrdersComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  orders$: Observable<Commande[]>;
  filteredOrders$: Observable<Commande[]>;
  currentStatus: string = 'ALL';

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) {
    this.orders$ = this.ordersService.getOrders().pipe(map(res => res.data || []));
    this.filteredOrders$ = this.orders$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Marketplace' },
      { label: 'Mes Commandes', active: true }
    ];
  }

  filterByStatus(status: string) {
    this.currentStatus = status;
    if (status === 'ALL') {
      this.filteredOrders$ = this.orders$;
    } else {
      this.filteredOrders$ = this.orders$.pipe(
        map(orders => orders.filter(o => o.statut === status))
      );
    }
  }

  viewOrderDetails(id: number) {
    this.router.navigate(['/client/orders', id]);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'EN_ATTENTE': return 'bg-warning-subtle text-warning';
      case 'VALIDEE': return 'bg-info-subtle text-info';
      case 'EXPEDIEE': return 'bg-primary-subtle text-primary';
      case 'LIVREE': return 'bg-success-subtle text-success';
      case 'ANNULEE': return 'bg-danger-subtle text-danger';
      default: return 'bg-light text-muted';
    }
  }
}
