import { Component, OnInit } from '@angular/core';
import { AnnouncerDashboardService } from '../../../core/services/announcer-dashboard.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: [],
  standalone: false
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;

  constructor(private announcerService: AnnouncerDashboardService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.announcerService.getAnnouncerOrders().subscribe((data: any[]) => {
      this.orders = data;
      this.isLoading = false;
    });
  }
}
