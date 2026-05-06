import { Component, OnInit, OnDestroy, EventEmitter, Output, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Cookie / Event Services
import { CookieService } from 'ngx-cookie-service';
import { EventService } from '../../core/services/event.service';

// Auth
import { AuthenticationService } from '../../core/services/auth.service';
import { User } from 'src/app/store/Authentication/auth.models';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-topbar-user',
  templateUrl: './topbaruser.component.html',
  styleUrls: ['./topbaruser.component.scss'],
  standalone: false
})
export class TopbarUserComponent implements OnInit, OnDestroy {

  // The HTML document element (used for fullscreen operations)
  element: any;

  // Current display mode ('light' | 'dark')
  mode: string | undefined;

  // Emitted when the mobile hamburger menu button is clicked
  @Output() mobileMenuButtonClicked = new EventEmitter();

  // Tracks whether any dropdown is open
  isDropdownOpen = false;

  // The currently logged-in user (null if visitor/not authenticated)
  currentUser: User | null = null;
  
  topbarCartItems: any[] = [];
  total = 0;
  cart_length = 0;

  // Used to clean up subscriptions when the component is destroyed
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService,
    public cookiesService: CookieService,
    private router: Router,
    private authService: AuthenticationService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.element = document.documentElement;
    
    // Subscribe to the cart observable to update the topbar UI reactively
    this.cartService.cart$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(cart => {
      if (cart) {
        this.topbarCartItems = (cart.lignes || []).map(ligne => {
          return {
            id: ligne.idAnnonce,
            annonceId: ligne.idAnnonce,
            product: ligne.annonceTitre || 'Produit inconnu',
            img: ligne.annonceImage || '',
            price: ligne.prixUnitaire,
            quantity: ligne.quantite
          };
        });
        this.cart_length = cart.lignes?.length || 0;
        this.total = cart.total || 0;
      } else {
        this.topbarCartItems = [];
        this.cart_length = 0;
        this.total = 0;
      }
    });

    // Subscribe to the current user observable to reactively toggle the topbar UI
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  onLogout() {
    this.authService.logout().subscribe();
  }

  get displayName(): string {
    if (!this.currentUser) return '';
    if (this.currentUser.prenom && this.currentUser.nom) {
        return `${this.currentUser.prenom} ${this.currentUser.nom}`;
    }
    return this.currentUser.email || 'Mon compte';
  }

  get photoUrl(): string {
    if (!this.currentUser?.photoProfilUrl) return '';
    if (this.currentUser.photoProfilUrl.startsWith('http')) return this.currentUser.photoProfilUrl;
    const baseUrl = 'http://localhost:5049'; // Default for local dev
    return `${baseUrl}${this.currentUser.photoProfilUrl.startsWith('/') ? '' : '/'}${this.currentUser.photoProfilUrl}`;
  }

  get avatarLetter(): string {
    return this.displayName.charAt(0).toUpperCase();
  }

  get dashboardLink(): string {
    if (!this.currentUser) return '/';
    switch (this.currentUser.role) {
      case 'ADMIN': return '/admin';
      case 'ANNONCEUR': return '/announcer/dashboard';
      case 'CLIENT': return '/client/profile';
      default: return '/';
    }
  }

  get roleLabel(): string {
    if (!this.currentUser) return '';
    switch (this.currentUser.role) {
      case 'ADMIN': return 'Administrateur';
      case 'ANNONCEUR': return 'Vendeur';
      case 'CLIENT': return 'Client';
      default: return 'Utilisateur';
    }
  }

  get isVerticalLayout(): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.role === 'ADMIN') return true;
    if (this.currentUser.role === 'ANNONCEUR' && this.router.url.startsWith('/announcer')) return true;
    return false;
  }

  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open');
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen)             { this.element.requestFullscreen(); }
      else if (this.element.mozRequestFullScreen)     { this.element.mozRequestFullScreen(); }
      else if (this.element.webkitRequestFullscreen)  { this.element.webkitRequestFullscreen(); }
      else if (this.element.msRequestFullscreen)      { this.element.msRequestFullscreen(); }
    } else {
      if (this.document.exitFullscreen)               { this.document.exitFullscreen(); }
      else if (this.document.mozCancelFullScreen)     { this.document.mozCancelFullScreen(); }
      else if (this.document.webkitExitFullscreen)    { this.document.webkitExitFullscreen(); }
      else if (this.document.msExitFullscreen)        { this.document.msExitFullscreen(); }
    }
  }

  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);
    document.documentElement.setAttribute('data-bs-theme', mode === 'dark' ? 'dark' : 'light');
  }

  windowScroll() {
    const topbar = document.getElementById('page-topbar');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      topbar?.classList.add('topbar-shadow');
    } else {
      topbar?.classList.remove('topbar-shadow');
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  deleteItem(event: any, id: any) {
    const item = this.topbarCartItems.find(i => i.id === id);
    if (item) {
      this.cartService.removeFromCart(item.annonceId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
