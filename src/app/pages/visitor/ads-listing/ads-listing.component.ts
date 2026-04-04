import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ads-listing',
  templateUrl: './ads-listing.component.html',
  styleUrls: ['./ads-listing.component.scss'],
  standalone: false
})
export class AdsListingComponent implements OnInit {

  categories = [
    { name: 'Électronique', icon: 'ri-smartphone-line', count: 1250 },
    { name: 'Immobilier', icon: 'ri-home-4-line', count: 850 },
    { name: 'Véhicules', icon: 'ri-car-line', count: 2100 },
    { name: 'Emploi', icon: 'ri-briefcase-line', count: 450 },
    { name: 'Mode', icon: 'ri-shirt-line', count: 3400 },
    { name: 'Maison', icon: 'ri-home-gear-line', count: 1100 }
  ];

  ads = [
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
    },
    {
      title: 'Veste en cuir Vintage',
      category: 'Mode',
      price: 85,
      location: 'Bordeaux',
      date: 'Il y a 3h',
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=400',
      sellerName: 'Marc L.',
      sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      rating: 4.5,
      isFavorite: false,
      isPremium: false
    },
    {
      title: 'Canapé Scandinave 3 Places',
      category: 'Maison',
      price: 450,
      location: 'Strasbourg',
      date: 'Hier',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
      sellerName: 'Sophie G.',
      sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
      rating: 4.6,
      isFavorite: false,
      isPremium: false
    }
  ];

  filteredAds = [...this.ads];
  selectedCategory: string | null = null;

  // Translation strings (Mockup for now, can be moved to i18n later)
  textResultsFound = 'annonces trouvées';
  textSearchPlaceholder = 'Rechercher dans cette catégorie...';
  textSortBy = 'Trier par :';
  textLatest = 'Plus récents';
  textPriceLowHigh = 'Prix : Croissant';
  textPriceHighLow = 'Prix : Décroissant';
  textTopRated = 'Mieux notés';
  textPrev = 'Précédent';
  textNext = 'Suivant';
  textShowingResults = 'Affichage de';
  textResultsLabel = 'résultats';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || null;
      const searchQuery = params['q'] || null;

      this.filterAds(this.selectedCategory, searchQuery);
    });
  }

  filterAds(category: string | null, query: string | null) {
    this.filteredAds = this.ads.filter(ad => {
      const matchCategory = !category || ad.category === category;
      const matchQuery = !query || ad.title.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }

}
