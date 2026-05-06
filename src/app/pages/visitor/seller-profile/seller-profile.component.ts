import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilisateursService } from '../../../core/services/utilisateurs.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Utilisateur, Annonce } from '../../../core/models';
import { User } from '../../../store/Authentication/auth.models';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { TUNISIA_CITIES } from '../../../core/constants/cities';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.scss'],
  standalone: false
})
export class SellerProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  apiUrl = environment.apiUrl;

  seller: Utilisateur | null = null;
  sellerAds: Annonce[] = [];
  searchTerm: string = '';
  selectedCity: string = '';
  cities = TUNISIA_CITIES;
  
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private utilisateursService: UtilisateursService,
    private authService: AuthenticationService
  ) { }

  currentUser: User | null = null;

  get filteredAds(): Annonce[] {
    let filtered = this.sellerAds;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(ad => 
        ad.titre.toLowerCase().startsWith(term)
      );
    }

    if (this.selectedCity) {
      filtered = filtered.filter(ad => ad.ville === this.selectedCity);
    }

    return filtered;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.loadSellerProfile(+idParam);
      } else {
        this.hasError = true;
        this.isLoading = false;
      }
    });

    this.authService.currentUser$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.currentUser = user;
    });
  }

  get isOwnProfile(): boolean {
    if (!this.currentUser || !this.seller) return false;
    return this.currentUser.idUtilisateur === this.seller.idUtilisateur;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get canSeeContactActions(): boolean {
    return this.isLoggedIn && !this.isOwnProfile;
  }

  get photoUrl(): string {
    const photoPath = this.seller?.photoProfilUrl || (this.seller as any)?.PhotoProfilUrl;
    if (!photoPath) return '';
    if (photoPath.startsWith('http')) return photoPath;
    const baseUrl = environment.imageBaseUrl || 'http://localhost:5049';
    return `${baseUrl}${photoPath.startsWith('/') ? '' : '/'}${photoPath}`;
  }

  loadSellerProfile(id: number) {
    this.isLoading = true;
    this.hasError = false;
    this.utilisateursService.getProfilPublic(id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.seller = (res.data as any).user || null;
          this.sellerAds = (res.data as any).ads || [];
          if (!this.seller) {
            this.hasError = true;
          }
        } else {
          this.hasError = true;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load seller profile', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  contactWhatsapp() {
    if (this.seller?.telephone) {
        const phone = this.formatPhoneForWhatsapp(this.seller.telephone);
        window.open(`https://wa.me/${phone}?text=Bonjour, je vous contacte depuis BigDeals.`, '_blank');
    }
  }

  private formatPhoneForWhatsapp(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
      cleaned = '216' + cleaned;
    }
    return cleaned;
  }

  contactPhone() {
    if (this.seller?.telephone) {
        window.location.href = `tel:${this.seller.telephone}`;
    }
  }

  get avatarLetter(): string {
    if (!this.seller) return '?';
    const name = this.seller.prenom || this.seller.nom || this.seller.email || '?';
    return name.charAt(0).toUpperCase();
  }

  onAvatarError(event: any) {
    event.target.src = 'assets/images/users/user-dummy-img.jpg';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
