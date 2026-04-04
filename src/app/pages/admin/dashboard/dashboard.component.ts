import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  stats = [
    { label: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.STATS.USERS', value: '1,250', icon: 'ri-user-line', color: 'primary', trend: '15' },
    { label: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.STATS.ADS', value: '4,320', icon: 'ri-stack-line', color: 'success', trend: '22' },
    { label: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.REQUESTS.TITLE', value: '12', icon: 'ri-briefcase-line', color: 'warning', trend: '5' },
    { label: 'MENUITEMS.BIGDEALS.SUPPORT.REVIEWS', value: '8', icon: 'ri-error-warning-line', color: 'danger', trend: '2' }
  ];

  announcerRequests = [
    { avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100', userName: 'Marc Lavoine', storeName: 'ElectroPlus', date: '25 Mar, 2024' },
    { avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', userName: 'Sophie Durand', storeName: 'Bijoux Chic', date: '24 Mar, 2024' },
    { avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', userName: 'Kevin Dupont', storeName: 'Gaming Store', date: '22 Mar, 2024' }
  ];

  activities = [
    { title: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.NEW_AD', desc: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.NEW_AD_DESC', time: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.TIME.MIN', icon: 'ri-stack-line', color: 'primary' },
    { title: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.PURCHASE', desc: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.PURCHASE_DESC', time: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.TIME.MIN_LONG', icon: 'ri-shopping-cart-line', color: 'success' },
    { title: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.NEW_USER', desc: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.NEW_USER_DESC', time: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.TIME.HOUR', icon: 'ri-user-add-line', color: 'info' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  approveRequest(req: any) {
    alert('Demande de ' + req.storeName + ' acceptée !');
    this.announcerRequests = this.announcerRequests.filter(r => r !== req);
  }

  rejectRequest(req: any) {
    alert('Demande de ' + req.storeName + ' refusée.');
    this.announcerRequests = this.announcerRequests.filter(r => r !== req);
  }

}
