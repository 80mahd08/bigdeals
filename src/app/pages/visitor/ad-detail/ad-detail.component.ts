import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.scss'],
  standalone: false
})
export class AdDetailComponent implements OnInit {

  ad = {
    title: 'iPhone 15 Pro Max - 256GB Titanium Blue',
    category: 'Électronique',
    price: 1100,
    description: 'Vends iPhone 15 Pro Max en parfait état. Toujours protégé par une coque et un verre trempé. Batterie à 100% de capacité. Vendu avec boîte et accessoires d\'origine.',
    date: '15 Mars 2024',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1695048133142-1a20484d256e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1695048132833-8758e579294e?auto=format&fit=crop&q=80&w=600'
    ],
    specs: [
      { label: 'Marque', value: 'Apple' },
      { label: 'Modèle', value: 'iPhone 15 Pro Max' },
      { label: 'Capacité', value: '256 GB' },
      { label: 'Couleur', value: 'Bleu Titane' },
      { label: 'État', value: 'Comme neuf' }
    ],
    sellerName: 'Jean Dupont',
    sellerAvatar: 'assets/images/users/avatar-1.jpg',
    rating: 4.8,
    isPremium: true
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // In a real app, we would fetch the ad by ID from a service
    // const id = this.route.snapshot.paramMap.get('id');
  }

  contactWhatsapp() {
    window.open('https://wa.me/33612345678', '_blank');
  }

  contactPhone() {
    alert('Appeler le vendeur : +33 6 12 34 56 78');
  }

}
