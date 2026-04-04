import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  stats = [
    { label: 'Annonces Totales', value: '25', icon: 'ri-stack-line', color: 'primary', trendIcon: 'ri-arrow-right-up-line', trendValue: '12' },
    { label: 'Vues Totales', value: '1,450', icon: 'ri-eye-line', color: 'info', trendIcon: 'ri-arrow-right-up-line', trendValue: '5' },
    { label: 'Messages', value: '42', icon: 'ri-chat-3-line', color: 'success', trendIcon: 'ri-arrow-right-up-line', trendValue: '8' },
    { label: 'Favoris', value: '158', icon: 'ri-heart-line', color: 'danger', trendIcon: 'ri-arrow-right-down-line', trendValue: '2' }
  ];

  recentAds = [
    {
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400',
      title: 'iPhone 15 Pro Max',
      date: '15 Mar, 2024',
      price: 1100,
      status: 'Active',
      statusColor: 'success',
      views: 450
    },
    {
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400',
      title: 'Appartement T3',
      date: '12 Mar, 2024',
      price: 250000,
      status: 'En Pause',
      statusColor: 'warning',
      views: 890
    },
    {
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400',
      title: 'MacBook Air M2',
      date: '10 Mar, 2024',
      price: 950,
      status: 'Vendu',
      statusColor: 'info',
      views: 720
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
