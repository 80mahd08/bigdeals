import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../../core/services/cart.service';
import { Panier, LignePanier } from '../../../core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  cart$: Observable<Panier | null>;
  
  taxRate = 0;
  shippingRate = 7.0;

  constructor(
    private cartService: CartService,
    private modalService: NgbModal
  ) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Marketplace' },
      { label: 'Panier', active: true }
    ];
  }

  increment(annonceId: number, currentQty: number) {
    this.cartService.updateQuantity(annonceId, currentQty + 1);
  }

  decrement(annonceId: number, currentQty: number) {
    if (currentQty > 1) {
      this.cartService.updateQuantity(annonceId, currentQty - 1);
    }
  }

  remove(annonceId: number) {
    this.cartService.removeFromCart(annonceId);
  }

  calculateSubtotal(cart: Panier): number {
    return cart.total || 0;
  }

  calculateTax(subtotal: number): number {
    return subtotal * this.taxRate;
  }

  calculateTotal(subtotal: number): number {
    const tax = this.calculateTax(subtotal);
    const shipping = subtotal > 0 ? this.shippingRate : 0;
    return subtotal + tax + shipping;
  }

  confirmDelete(content: any, annonceId: number) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      if (result === 'delete') {
        this.remove(annonceId);
      }
    }, () => {});
  }
}
