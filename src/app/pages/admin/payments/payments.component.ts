import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminPaymentsService } from 'src/app/core/services/admin-payments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone: false
})
export class PaymentsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  protected Math = Math;
  breadCrumbItems!: Array<{}>;
  
  payments: any[] = [];
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;
  searchTerm = '';

  private searchSubject = new Subject<string>();

  constructor(
    private paymentService: AdminPaymentsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Administration' },
      { label: 'Paiements annonceurs', active: true }
    ];

    // Initialize from URL
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.page = params['page'] ? parseInt(params['page']) : 1;
      this.searchTerm = params['q'] || '';
      this.loadPayments();
    });

    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.searchTerm = value;
      this.page = 1;
      this.updateUrl();
    });
  }

  loadPayments() {
    this.loading = true;
    this.paymentService.getAllPayments(this.page, this.pageSize, this.searchTerm || undefined).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.payments = res.data.items;
          this.totalItems = res.data.totalItems;
        }
      },
      error: () => {
        this.loading = false;
        Swal.fire('Erreur', 'Impossible de charger les paiements.', 'error');
      }
    });
  }

  updateUrl() {
    const queryParams: any = {};
    if (this.page > 1) queryParams.page = this.page;
    if (this.searchTerm) queryParams.q = this.searchTerm;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: null
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.updateUrl();
  }

  performSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  resetFilters() {
    this.searchTerm = '';
    this.page = 1;
    this.updateUrl();
  }

  markAsPaid(id: number) {
    Swal.fire({
      title: 'Confirmer le paiement ?',
      text: "Voulez-vous marquer ce paiement comme reçu ? Cela activera le profil annonceur.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentService.markAsPaid(id).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('Succès', 'Paiement confirmé.', 'success');
            this.loadPayments();
          } else {
            Swal.fire('Erreur', res.message || 'Une erreur est survenue.', 'error');
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
