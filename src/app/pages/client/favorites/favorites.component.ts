import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: false
})
export class FavoritesComponent implements OnInit {

  favorites = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max',
      category: 'Électronique',
      price: 1100,
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400',
      date: 'Il y a 2h'
    },
    {
      id: 2,
      title: 'Appartement T3 Vue Mer',
      category: 'Immobilier',
      price: 250000,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400',
      date: 'Il y a 5h'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  removeFavorite(ad: any) {
    this.favorites = this.favorites.filter(item => item.id !== ad.id);
  }

}
