import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: false
})
export class LandingComponent implements OnInit {

  categories = [
    { name: 'Électronique', icon: 'ri-smartphone-line', count: '1,250', color: 'primary' },
    { name: 'Immobilier', icon: 'ri-home-4-line', count: '850', color: 'success' },
    { name: 'Véhicules', icon: 'ri-car-line', count: '2,100', color: 'info' },
    { name: 'Emploi', icon: 'ri-briefcase-line', count: '450', color: 'warning' },
    { name: 'Mode', icon: 'ri-shirt-line', count: '3,400', color: 'danger' },
    { name: 'Maison', icon: 'ri-home-gear-line', count: '1,100', color: 'secondary' },
    { name: 'Sport', icon: 'ri-basketball-line', count: '600', color: 'success' },
    { name: 'Services', icon: 'ri-customer-service-2-line', count: '300', color: 'primary' }
  ];

  featuredAds = [
    {
      title: 'iPhone 15 Pro Max - 256GB',
      category: 'Électronique',
      price: 1100,
      location: 'Paris',
      date: 'Il y a 2h',
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400',
      sellerName: 'Jean Dupont',
      sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
      rating: 4.8,
      isFavorite: false,
      isPremium: true
    },
    {
      title: 'Appartement T3 Vue Mer',
      category: 'Immobilier',
      price: 250000,
      location: 'Marseille',
      date: 'Il y a 5h',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400',
      sellerName: 'ImmoTech',
      sellerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
      rating: 4.9,
      isFavorite: true,
      isPremium: false
    },
    {
      title: 'MacBook Air M2 Silver',
      category: 'Électronique',
      price: 950,
      location: 'Lyon',
      date: 'Hier',
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400',
      sellerName: 'Alice Martin',
      sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      rating: 4.7,
      isFavorite: false,
      isPremium: false
    },
    {
      title: 'Tesla Model 3 Performance',
      category: 'Véhicules',
      price: 35000,
      location: 'Nantes',
      date: 'Il y a 1j',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=400',
      sellerName: 'AutoPremium',
      sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      rating: 5.0,
      isFavorite: false,
      isPremium: true
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
