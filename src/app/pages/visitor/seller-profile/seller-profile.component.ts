import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.scss'],
  standalone: false
})
export class SellerProfileComponent implements OnInit {

  seller = {
    name: 'Jean Dupont',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    location: 'Paris, France',
    adsCount: 15,
    reviewsCount: 42,
    rating: 4.8
  };

  sellerAds = [
    {
      title: 'iPhone 15 Pro Max',
      category: 'Électronique',
      price: 1100,
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400',
      date: 'Il y a 2h'
    },
    {
      title: 'AirPods Pro 2',
      category: 'Électronique',
      price: 199,
      image: 'https://images.unsplash.com/photo-1588423770186-80f856c81db2?auto=format&fit=crop&q=80&w=400',
      date: 'Il y a 1j'
    },
    {
      title: 'iPad Pro M2',
      category: 'Électronique',
      price: 890,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400',
      date: 'Il y a 3j'
    }
  ];

  reviews = [
    {
      user: 'Alice M.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      rating: 5,
      date: '12 Mars 2024',
      comment: 'Excellent vendeur, produit conforme et livraison rapide. Je recommande !'
    },
    {
      user: 'Marc L.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      rating: 4,
      date: '05 Mars 2024',
      comment: 'Très bonne communication, l\'objet est en très bon état.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
