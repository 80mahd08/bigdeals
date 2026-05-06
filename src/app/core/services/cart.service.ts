import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { Panier, LignePanier, Annonce } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Panier | null>(null);
  public cart$ = this.cartSubject.asObservable();

  get cartValue(): Panier | null {
    return this.cartSubject.value;
  }

  constructor(private authService: AuthenticationService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCart();
      } else {
        this.cartSubject.next(null);
      }
    });
  }

  private getStorageKey(): string {
    const user = this.authService.currentUserValue;
    if (!user) {
      throw new Error('Action réservée aux utilisateurs connectés');
    }
    return `cart_${user.idUtilisateur}`;
  }

  private loadCart(): void {
    const key = this.getStorageKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      this.cartSubject.next(JSON.parse(stored));
    } else {
      const user = this.authService.currentUserValue;
      const initialCart: Panier = {
        idPanier: Math.floor(Math.random() * 1000),
        idUtilisateur: user?.idUtilisateur || 0,
        lignes: [],
        total: 0
      };
      this.saveCart(initialCart);
    }
  }

  private saveCart(cart: Panier): void {
    cart.total = this.calculateTotal(cart);
    localStorage.setItem(this.getStorageKey(), JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  private calculateTotal(cart: Panier): number {
    return (cart.lignes || []).reduce((acc, ligne) => acc + (ligne.prixUnitaire || 0) * ligne.quantite, 0);
  }

  addToCart(annonce: Annonce, quantite: number = 1): void {
    const cart = this.cartSubject.value;
    if (!cart) return;

    const existingLigne = cart.lignes?.find(l => l.idAnnonce === annonce.idAnnonce);
    if (existingLigne) {
      existingLigne.quantite += quantite;
    } else {
      const newLigne: LignePanier = {
        idLignePanier: Math.floor(Math.random() * 10000),
        idPanier: cart.idPanier,
        idAnnonce: annonce.idAnnonce,
        annonceTitre: annonce.titre,
        annonceImage: annonce.mainImageUrl,
        quantite: quantite,
        prixUnitaire: Number(annonce.prix)
      };
      cart.lignes = [...(cart.lignes || []), newLigne];
    }
    this.saveCart(cart);
  }

  updateQuantity(idAnnonce: number, quantite: number): void {
    const cart = this.cartSubject.value;
    if (!cart || !cart.lignes) return;

    const ligne = cart.lignes.find(l => l.idAnnonce === idAnnonce);
    if (ligne) {
      ligne.quantite = quantite;
      if (ligne.quantite <= 0) {
        this.removeFromCart(idAnnonce);
      } else {
        this.saveCart(cart);
      }
    }
  }

  removeFromCart(idAnnonce: number): void {
    const cart = this.cartSubject.value;
    if (!cart || !cart.lignes) return;

    cart.lignes = cart.lignes.filter(l => l.idAnnonce !== idAnnonce);
    this.saveCart(cart);
  }

  clearCart(): void {
    const cart = this.cartSubject.value;
    if (!cart) return;

    cart.lignes = [];
    this.saveCart(cart);
  }
}
