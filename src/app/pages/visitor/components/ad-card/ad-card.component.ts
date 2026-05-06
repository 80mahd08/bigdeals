import { Component, Input } from '@angular/core';
import { Annonce } from '../../../../core/models';
import { environment } from 'src/environments/environment';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { AuthenticationService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ad-card',
  templateUrl: './ad-card.component.html',
  styleUrls: ['./ad-card.component.scss'],
  standalone: false
})
export class AdCardComponent {
  @Input() ad!: Annonce;
  @Input() compact: boolean = false;

  apiUrl = environment.apiUrl;

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/signin']);
      return;
    }
    
    this.favoritesService.toggleFavorite(this.ad.idAnnonce);
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.ad.idAnnonce);
  }

  contactPhone(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    // In a real app, this would be the advertiser's number
    window.location.href = 'tel:+21655123456';
  }

  contactWhatsapp(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    // Mock WhatsApp link
    window.open('https://wa.me/21655123456?text=Je suis intéressé par votre annonce : ' + this.ad.titre, '_blank');
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/small/img-4.jpg'; // Fallback placeholder
  }

  get imageUrl(): string {
    if (!this.ad.mainImageUrl) return 'assets/images/small/img-4.jpg';
    if (this.ad.mainImageUrl.startsWith('http')) return this.ad.mainImageUrl;
    const baseUrl = environment.imageBaseUrl || 'http://localhost:5049';
    return `${baseUrl}${this.ad.mainImageUrl.startsWith('/') ? '' : '/'}${this.ad.mainImageUrl}`;
  }

  get sellerPhotoUrl(): string {
    if (!this.ad.annonceurPhotoUrl) return '';
    if (this.ad.annonceurPhotoUrl.startsWith('http')) return this.ad.annonceurPhotoUrl;
    const baseUrl = environment.imageBaseUrl || 'http://localhost:5049';
    return `${baseUrl}${this.ad.annonceurPhotoUrl.startsWith('/') ? '' : '/'}${this.ad.annonceurPhotoUrl}`;
  }

  get avatarLetter(): string {
    if (this.ad.annonceurNom) {
      return this.ad.annonceurNom.charAt(0).toUpperCase();
    }
    return '?';
  }
}
