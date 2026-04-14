import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexTooltip,
  ApexYAxis,
  ApexLegend
} from 'ng-apexcharts';

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  grid?: ApexGrid;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  yaxis?: ApexYAxis;
  legend?: ApexLegend;
  colors?: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  @ViewChild('chart') chart!: ChartComponent;

  stats = [
    { label: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.STATS.USERS',    value: '1,250', icon: 'ri-user-line',           color: 'primary', trend: '15',  trendUp: true  },
    { label: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.STATS.ADS',      value: '4,320', icon: 'ri-stack-line',          color: 'success', trend: '22',  trendUp: true  },
    { label: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.STATS.REVENUE',  value: '$28.4K',icon: 'ri-money-dollar-circle-line', color: 'info', trend: '8', trendUp: true  },
    { label: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.STATS.FLAGGED',  value: '6',     icon: 'ri-flag-line',           color: 'danger',  trend: '2',   trendUp: false }
  ];

  announcerRequests = [
    { avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100', userName: 'Marc Lavoine', storeName: 'ElectroPlus', date: '25 Mar, 2024' },
    { avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', userName: 'Sophie Durand', storeName: 'Bijoux Chic', date: '24 Mar, 2024' },
    { avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', userName: 'Kevin Dupont', storeName: 'Gaming Store', date: '22 Mar, 2024' }
  ];

  topSellers = [
    { name: 'ElectroPlus',   category: 'Electronics', ads: 48, revenue: '$12,400', rating: 4.9 },
    { name: 'ModeCity',      category: 'Fashion',      ads: 35, revenue: '$8,200',  rating: 4.7 },
    { name: 'AutoMarket',    category: 'Automotive',   ads: 29, revenue: '$6,850',  rating: 4.5 },
    { name: 'ImmoPro',       category: 'Real Estate',  ads: 22, revenue: '$5,300',  rating: 4.6 },
    { name: 'GameZone',      category: 'Electronics',  ads: 18, revenue: '$3,950',  rating: 4.3 }
  ];

  recentCustomers = [
    { name: 'Alexandre Roux', email: 'alex.roux@example.com', date: '14 Apr, 2024', status: 'Pending' },
    { name: 'Marie Leroy', email: 'marie.leroy@example.com', date: '13 Apr, 2024', status: 'Pending' },
    { name: 'Thomas Vidal', email: 'thomas.v@example.com', date: '13 Apr, 2024', status: 'Pending' },
    { name: 'Emma Blanc', email: 'emma.blanc@example.com', date: '12 Apr, 2024', status: 'Pending' }
  ];

  activities = [
    { title: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.NEW_AD',     desc: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.NEW_AD_DESC',     time: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.TIME.MIN',      icon: 'ri-stack-line',         color: 'primary' },
    { title: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.PURCHASE',   desc: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.PURCHASE_DESC',   time: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.TIME.MIN_LONG', icon: 'ri-shopping-cart-line', color: 'success' },
    { title: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.NEW_USER',   desc: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.NEW_USER_DESC',   time: 'MENUITEMS.BIGDEALS.ADMIN_DASHBOARD.ACTIVITY.TIME.HOUR',     icon: 'ri-user-add-line',      color: 'info'    }
  ];

  revenueChartOptions: ChartOptions = {
    series: [
      {
        name: 'Revenue',
        data: [4200, 5800, 5100, 7300, 6900, 8400, 9200, 8700, 10100, 11200, 9800, 12500]
      },
      {
        name: 'Ads Posted',
        data: [310, 420, 390, 510, 480, 590, 640, 610, 700, 780, 690, 850]
      }
    ],
    chart: { type: 'area', height: 250, toolbar: { show: false } },
    colors: ['#0ab39c', '#405189'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 95, 100] } },
    stroke: { width: [2, 2], curve: 'smooth' },
    xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 3, borderColor: '#e9ebec' },
    legend: { show: true, position: 'top' },
    tooltip: { shared: true, intersect: false }
  };

  constructor() { }
  ngOnInit(): void { }

  approveRequest(req: any) {
    alert('Demande de ' + req.storeName + ' acceptée !');
    this.announcerRequests = this.announcerRequests.filter(r => r !== req);
  }

  rejectRequest(req: any) {
    alert('Demande de ' + req.storeName + ' refusée.');
    this.announcerRequests = this.announcerRequests.filter(r => r !== req);
  }

  validateCustomer(customer: any) {
    customer.status = 'Validated';
    alert('Client ' + customer.name + ' validé.');
    this.recentCustomers = this.recentCustomers.filter(c => c !== customer);
  }

  blockCustomer(customer: any) {
    customer.status = 'Blocked';
    alert('Client ' + customer.name + ' bloqué.');
    this.recentCustomers = this.recentCustomers.filter(c => c !== customer);
  }
}
