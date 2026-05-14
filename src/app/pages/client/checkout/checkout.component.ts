import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { OrdersService } from '../../../core/services/orders.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Panier } from '../../../core/models';
import { MethodePaiement } from '../../../core/enums';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/store/Authentication/auth.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: false
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart: Panier | null = null;
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  // Stepper
  currentStep = 1;
  steps = [
    { number: 1, title: 'Panier',       icon: 'ri-shopping-cart-2-line' },
    { number: 2, title: 'Adresse',      icon: 'ri-map-pin-line' },
    { number: 3, title: 'Paiement',     icon: 'ri-bank-card-line' },
    { number: 4, title: 'Confirmation', icon: 'ri-checkbox-circle-line' }
  ];

  // Forms
  addressForm!: FormGroup;
  paymentForm!: FormGroup;

  // Address state
  hasSavedAddress = false;
  isSavingAddress = false;

  // Tunisian cities (gouvernorats)
  villes: string[] = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba',
    'Nabeul', 'Zaghouan', 'Bizerte', 'Béja',
    'Jendouba', 'Le Kef', 'Siliana', 'Sousse',
    'Monastir', 'Mahdia', 'Sfax', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Gabès', 'Médenine',
    'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
  ];

  // Financial
  shippingRate = 7.0;

  // Processing
  isProcessing = false;
  paymentSuccess = false;
  finalTotal = 0;

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private authService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Subscribe to cart
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe(cart => {
      this.cart = cart;
    });

    // Subscribe to user — pre-fill address from DB
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
      if (user?.ville && user?.adresse) {
        this.hasSavedAddress = true;
        this.addressForm?.patchValue({
          ville: user.ville,
          adresse: user.adresse
        });
      }
    });

    // Build address form
    this.addressForm = this.fb.group({
      ville: ['', [Validators.required]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[2579]\d{7}$/)]]
    });

    // Pre-fill from current user if available
    if (this.currentUser?.ville && this.currentUser?.adresse) {
      this.hasSavedAddress = true;
      this.addressForm.patchValue({
        ville: this.currentUser.ville,
        adresse: this.currentUser.adresse,
        telephone: this.currentUser.telephone || ''
      });
    } else if (this.currentUser?.telephone) {
      this.addressForm.patchValue({ telephone: this.currentUser.telephone });
    }

    // Build payment form
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Quantity Controls ────────────────────────
  increment(annonceId: number, currentQty: number): void {
    this.cartService.updateQuantity(annonceId, currentQty + 1);
  }

  decrement(annonceId: number, currentQty: number): void {
    if (currentQty > 1) {
      this.cartService.updateQuantity(annonceId, currentQty - 1);
    }
  }

  removeItem(annonceId: number): void {
    this.cartService.removeFromCart(annonceId);
  }

  // ─── Financial ────────────────────────────────
  get subtotal(): number {
    return this.cart?.total || 0;
  }

  get total(): number {
    return this.subtotal + (this.subtotal > 0 ? this.shippingRate : 0);
  }

  get hasItems(): boolean {
    return !!(this.cart?.lignes && this.cart.lignes.length > 0);
  }

  // ─── Form Accessors ───────────────────────────
  get fa() { return this.addressForm.controls; }
  get fp() { return this.paymentForm.controls; }

  // ─── Payment Formatting ───────────────────────
  formatCardNumber(event: any): void {
    let input = event.target.value.replace(/\D/g, '').substring(0, 16);
    this.paymentForm.patchValue({ cardNumber: input });
  }

  formatExpiry(event: any): void {
    let input = event.target.value.replace(/\D/g, '').substring(0, 4);
    if (input.length > 2) {
      input = input.substring(0, 2) + '/' + input.substring(2, 4);
    }
    this.paymentForm.patchValue({ expiry: input });
    
    // Custom validation for future date
    if (input.length === 5) {
      const [month, year] = input.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        this.paymentForm.get('expiry')?.setErrors({ expired: true });
      }
    }
  }

  formatCvv(event: any): void {
    let input = event.target.value.replace(/\D/g, '').substring(0, 3);
    this.paymentForm.patchValue({ cvv: input });
  }

  // ─── Stepper Navigation ───────────────────────
  goToStep(step: number): void {
    // Can only go back freely
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (!this.hasItems) return;
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.saveAddressAndProceed();
    } else if (this.currentStep === 3) {
      this.processPayment();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1 && this.currentStep < 4) {
      this.currentStep--;
    }
  }

  // ─── Address Save (to DB via PUT /api/users/me) ───
  private saveAddressAndProceed(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const ville = this.addressForm.value.ville;
    const adresse = this.addressForm.value.adresse;
    const telephone = this.addressForm.value.telephone;

    // If nothing changed, skip the API call
    if (this.currentUser?.ville === ville && this.currentUser?.adresse === adresse && this.currentUser?.telephone === telephone) {
      this.currentStep = 3;
      return;
    }

    this.isSavingAddress = true;
    const formData = new FormData();
    formData.append('Ville', ville);
    formData.append('Adresse', adresse);
    formData.append('Telephone', telephone);

    this.authService.updateProfile(formData).subscribe({
      next: () => {
        this.isSavingAddress = false;
        this.hasSavedAddress = true;
        this.currentStep = 3;
      },
      error: () => {
        this.isSavingAddress = false;
        Swal.fire('Erreur', 'Impossible de sauvegarder l\'adresse.', 'error');
      }
    });
  }

  // ─── Payment Processing (MOCK) ────────────────
  private processPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (this.fp['cardNumber'].value.startsWith('0000')) {
      Swal.fire('Paiement refusé', 'Carte non valide ou bloquée (Simulation).', 'error');
      return;
    }

    this.isProcessing = true;

    // Build delivery address from step 2 form
    const deliveryAddress = {
      adresse: this.addressForm.value.adresse,
      ville: this.addressForm.value.ville,
      telephone: this.addressForm.value.telephone
    };

    // Simulated delay for mock payment
    setTimeout(() => {
      this.ordersService.checkout(MethodePaiement.CARTE_BANCAIRE, deliveryAddress).subscribe({
        next: () => {
          this.finalTotal = this.total;
          this.cartService.clearCart();
          this.isProcessing = false;
          this.paymentSuccess = true;
          this.currentStep = 4;
        },
        error: (err) => {
          this.isProcessing = false;
          const msg = err.error?.message || 'Impossible de valider la commande.';
          Swal.fire('Erreur', msg, 'error');
        }
      });
    }, 1500);
  }

  goToOrders(): void {
    this.router.navigate(['/client/orders']);
  }

  goToAds(): void {
    this.router.navigate(['/ads']);
  }
}
