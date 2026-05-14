import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Panier, LignePanier, Annonce } from '../models';
import { AuthenticationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Panier | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private authService: AuthenticationService) {
    this.authService.currentUser$.subscribe(user => {
      this.cartSubject.next(this.loadCartFromStorage(user?.idUtilisateur || 0));
    });
  }

  private loadCartFromStorage(userId: number): Panier | null {
    const key = userId > 0 ? `cart_${userId}` : 'cart_guest';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const cart = JSON.parse(saved);
        return cart;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private saveCart(cart: Panier | null) {
    const user = this.authService.currentUserValue;
    const key = user ? `cart_${user.idUtilisateur}` : 'cart_guest';
    
    if (cart) {
      localStorage.setItem(key, JSON.stringify(cart));
    } else {
      localStorage.removeItem(key);
    }
    this.cartSubject.next(cart);
  }

  addToCart(annonce: Annonce) {
    let current = this.cartSubject.value;
    if (!current) {
      current = { id: 0, idUtilisateur: 0, lignes: [], total: 0 };
    }

    const existing = current.lignes?.find(l => l.idAnnonce === annonce.idAnnonce);
    if (existing) {
      existing.quantite++;
    } else {
      current.lignes = current.lignes || [];
      current.lignes.push({
        id: 0,
        idPanier: current.id,
        idAnnonce: annonce.idAnnonce,
        quantite: 1,
        prixUnitaire: annonce.prix || 0,
        annonceTitre: annonce.titre,
        annonceImage: (annonce.images && annonce.images.length > 0) ? annonce.images[0].url : (annonce.mainImageUrl || '')
      });
    }

    this.updateTotal(current);
    this.saveCart(current);
  }

  updateQuantity(annonceId: number, qty: number) {
    const current = this.cartSubject.value;
    if (!current) return;

    const ligne = current.lignes?.find(l => l.idAnnonce === annonceId);
    if (ligne) {
      ligne.quantite = qty;
      if (ligne.quantite <= 0) {
        this.removeFromCart(annonceId);
      } else {
        this.updateTotal(current);
        this.saveCart(current);
      }
    }
  }

  removeFromCart(annonceId: number) {
    const current = this.cartSubject.value;
    if (!current) return;

    current.lignes = (current.lignes || []).filter(l => l.idAnnonce !== annonceId);
    this.updateTotal(current);
    this.saveCart(current);
  }

  clearCart() {
    this.saveCart(null);
  }

  private updateTotal(cart: Panier) {
    cart.total = (cart.lignes || []).reduce((acc, l) => acc + (l.prixUnitaire * l.quantite), 0);
  }

  getAnnonceForLigne(annonceId: number): any {
    // In a real app, we might fetch from a cache or the API.
    // For the topbar, we just need the title and first image.
    // We could store the whole annonce in the cart, but for now we rely on what's there.
    return null; // The topbar logic handles the fallback
  }
}
