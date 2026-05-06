import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { OrdersService } from '../../../core/services/orders.service';
import { Panier } from '../../../core/models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  cart$: Observable<Panier | null>;
  selectedMethod: number = 1; // Default to Delivery

  taxRate = 0.125;
  shippingRate = 7; 

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Marketplace' },
      { label: 'Panier', link: '/client/cart' },
      { label: 'Checkout', active: true }
    ];
  }

  calculateSubtotal(cart: Panier): number {
    return cart.lignes?.reduce((acc, curr) => acc + ((curr.prixUnitaire || 0) * curr.quantite), 0) || 0;
  }

  calculateTax(subtotal: number): number {
    return subtotal * this.taxRate;
  }

  calculateTotal(subtotal: number): number {
    if (subtotal === 0) return 0;
    return subtotal + this.calculateTax(subtotal) + this.shippingRate;
  }

  onPlaceOrder(cart: Panier) {
    const subtotal = this.calculateSubtotal(cart);
    const total = this.calculateTotal(subtotal);

    Swal.fire({
      title: 'Confirmer la commande',
      text: `Voulez-vous valider votre commande de ${Math.round(total)} TND ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, commander',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#0ab39c',
      cancelButtonColor: '#f06548'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
            idPanier: cart.idPanier,
            methodePaiement: this.selectedMethod,
            total: total
        };
        this.ordersService.checkout(payload).subscribe(res => {
          if (res.success && res.data) {
              Swal.fire({
                title: 'Succès !',
                text: 'Votre commande a été enregistrée avec succès.',
                icon: 'success',
                confirmButtonColor: '#0ab39c'
              }).then(() => {
                this.router.navigate(['/client/orders']);
              });
          }
        });
      }
    });
  }

  get paymentMethods() {
    return [
      { id: 1, label: 'Paiement à la livraison', icon: 'ri-truck-line' },
      { id: 2, label: 'D17 (Poste Tunisienne)', icon: 'ri-wallet-line' },
      { id: 3, label: 'E-Dinar', icon: 'ri-bank-card-line' },
      { id: 4, label: 'Espèces (Main à main)', icon: 'ri-hand-coin-line' }
    ];
  }
}
