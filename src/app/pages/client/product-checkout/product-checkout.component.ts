import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from '../../../core/services/checkout.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss'],
  standalone: false
})
export class ProductCheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  commandeDetails?: any;
  isLoading = true;
  isProcessing = false;
  hasError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const idAnnonce = this.route.snapshot.paramMap.get('id');
    if (idAnnonce) {
      this.createCheckout(+idAnnonce);
    } else {
      this.hasError = true;
      this.errorMessage = 'Annonce invalide.';
      this.isLoading = false;
    }
  }

  private initForm(): void {
    this.checkoutForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  get f() { return this.checkoutForm.controls; }

  private createCheckout(idAnnonce: number): void {
    this.isLoading = true;
    this.checkoutService.createCheckout(idAnnonce).subscribe({
      next: (res) => {
        this.commandeDetails = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.hasError = true;
        this.errorMessage = err.error?.message || 'Erreur lors de la création de la commande.';
        this.isLoading = false;
        Swal.fire('Erreur', this.errorMessage, 'error').then(() => {
          this.router.navigate(['/ads', idAnnonce]);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid || !this.commandeDetails) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.f['cardNumber'].value.startsWith('0000')) {
      Swal.fire('Paiement refusé', 'Carte non valide ou bloquée (Simulation).', 'error');
      return;
    }

    this.isProcessing = true;
    const request = {
      idCommande: this.commandeDetails.idCommande,
      cardNumber: this.f['cardNumber'].value,
      expiry: this.f['expiry'].value,
      cvv: this.f['cvv'].value
    };

    this.checkoutService.processMockPayment(request).subscribe({
      next: (res) => {
        this.isProcessing = false;
        Swal.fire({
          title: 'Paiement réussi !',
          text: 'Votre commande a été payée avec succès.',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/client/profile']); // Navigate to orders if available
        });
      },
      error: (err) => {
        this.isProcessing = false;
        const msg = err.error?.message || 'Erreur lors du paiement.';
        Swal.fire('Paiement refusé', msg, 'error');
      }
    });
  }

  formatCardNumber(event: any): void {
    let input = event.target.value.replace(/\D/g, '').substring(0, 16);
    this.checkoutForm.patchValue({ cardNumber: input });
  }

  formatExpiry(event: any): void {
    let input = event.target.value.replace(/\D/g, '').substring(0, 4);
    if (input.length > 2) {
      input = input.substring(0, 2) + '/' + input.substring(2, 4);
    }
    this.checkoutForm.patchValue({ expiry: input });
  }

  formatCvv(event: any): void {
    let input = event.target.value.replace(/\D/g, '').substring(0, 3);
    this.checkoutForm.patchValue({ cvv: input });
  }
}
