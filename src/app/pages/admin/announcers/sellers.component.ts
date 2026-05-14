import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminDemandesAnnonceurService } from 'src/app/core/services/admin-demandes-annonceur.service';
import { DemandeAnnonceur } from 'src/app/core/models';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-sellers',
    templateUrl: './sellers.component.html',
    styleUrls: ['./sellers.component.scss'],
    standalone: false
})
export class SellersComponent implements OnInit, OnDestroy {
  protected Math = Math;
  breadCrumbItems!: Array<{}>;
  requests: DemandeAnnonceur[] = [];
  loading = false;
  error = false;
  imageBaseUrl = environment.imageBaseUrl;
  imageErrors = new Set<number>();

  // Pagination
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;

  // Filters
  searchQuery = '';
  statusFilter: string = ''; // Use string to match URL params better

  private searchSubject = new Subject<string>();
  private subs = new Subscription();

  constructor(
    private adminService: AdminDemandesAnnonceurService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Administration' },
      { label: "Demandes d'annonceurs", active: true }
    ];

    // Initialize from URL
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.pageNumber = params['page'] ? parseInt(params['page']) : 1;
        this.searchQuery = params['q'] || '';
        this.statusFilter = params['status'] || '';
        this.loadRequests();
      })
    );

    // Setup search debouncing
    this.subs.add(
      this.searchSubject.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe(value => {
        this.searchQuery = value;
        this.pageNumber = 1;
        this.updateUrl();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadRequests() {
    this.loading = true;
    this.error = false;
    this.imageErrors.clear();
    
    const statut = this.statusFilter !== '' ? parseInt(this.statusFilter) : undefined;
    
    this.adminService.getAllRequests(this.pageNumber, this.pageSize, statut, this.searchQuery).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.requests = res.data.items;
          this.totalCount = res.data.totalCount;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        console.error('Error loading demandes', err);
        // Swal.fire('Erreur', 'Impossible de charger les demandes.', 'error');
      }
    });
  }

  updateUrl() {
    const queryParams: any = {};
    if (this.pageNumber > 1) queryParams.page = this.pageNumber;
    if (this.searchQuery) queryParams.q = this.searchQuery;
    if (this.statusFilter !== '') queryParams.status = this.statusFilter;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: null
    });
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.updateUrl();
  }

  performSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  onStatusChange() {
    this.pageNumber = 1;
    this.updateUrl();
  }

  resetFilters() {
    this.searchQuery = '';
    this.statusFilter = '';
    this.pageNumber = 1;
    this.updateUrl();
  }

  getPhotoUrl(photoPath: string | null | undefined): string {
    if (!photoPath) return '';
    if (photoPath.startsWith('http')) return photoPath;
    const baseUrl = this.imageBaseUrl || 'http://localhost:5049';
    return `${baseUrl}${photoPath.startsWith('/') ? '' : '/'}${photoPath}`;
  }

  onImageError(id: number) {
    this.imageErrors.add(id);
  }

  viewDocument(id: number) {
    this.adminService.getDocument(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: () => Swal.fire('Erreur', 'Impossible d\'ouvrir le document.', 'error')
    });
  }

  approve(id: number) {
    Swal.fire({
      title: 'Valider ce document ?',
      text: "L’utilisateur devra ensuite payer les frais d’accès annonceur.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approuver',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#0ab39c',
      cancelButtonColor: '#f06548',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.approveRequest(id).subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire('Succès', 'Document validé. La demande est maintenant en attente de paiement.', 'success');
              this.loadRequests();
            } else {
              Swal.fire('Erreur', res.message || 'Une erreur est survenue.', 'error');
            }
          },
          error: () => Swal.fire('Erreur', 'Une erreur technique est survenue.', 'error')
        });
      }
    });
  }

  reject(id: number) {
    Swal.fire({
      title: 'Motif du rejet',
      input: 'textarea',
      inputPlaceholder: 'Expliquez pourquoi la demande est rejetée...',
      showCancelButton: true,
      confirmButtonText: 'Rejeter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#f06548',
      inputValidator: (value) => {
        if (!value) {
          return 'Le motif du rejet est obligatoire !';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.rejectRequest(id, result.value).subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire('Rejeté', 'La demande a été rejetée.', 'success');
              this.loadRequests();
            } else {
              Swal.fire('Erreur', res.message || 'Une erreur est survenue.', 'error');
            }
          },
          error: () => Swal.fire('Erreur', 'Une erreur technique est survenue.', 'error')
        });
      }
    });
  }

  // --- Helpers ---

  getStatusLabel(statut: number | string): string {
    const s = statut?.toString();
    switch (s) {
      case '1':
      case 'EN_ATTENTE_VERIFICATION':
        return 'À vérifier';
      case '2':
      case 'APPROUVEE':
        return 'Approuvée';
      case '3':
      case 'REJETEE':
        return 'Rejetée';
      case '4':
      case 'EN_ATTENTE_PAIEMENT':
        return 'En attente paiement';
      default:
        return 'Inconnu';
    }
  }

  getStatusClass(statut: number | string): string {
    const s = statut?.toString();
    switch (s) {
      case '1':
      case 'EN_ATTENTE_VERIFICATION':
        return 'bg-info-subtle text-info';
      case '2':
      case 'APPROUVEE':
        return 'bg-success-subtle text-success';
      case '3':
      case 'REJETEE':
        return 'bg-danger-subtle text-danger';
      case '4':
      case 'EN_ATTENTE_PAIEMENT':
        return 'bg-warning-subtle text-warning';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  }

  isPendingVerification(statut: number | string): boolean {
    const s = statut?.toString();
    return s === '1' || s === 'EN_ATTENTE_VERIFICATION';
  }

  isWaitingPayment(statut: number | string): boolean {
    const s = statut?.toString();
    return s === '4' || s === 'EN_ATTENTE_PAIEMENT';
  }

  isApproved(statut: number | string): boolean {
    const s = statut?.toString();
    return s === '2' || s === 'APPROUVEE';
  }

  isRejected(statut: number | string): boolean {
    const s = statut?.toString();
    return s === '3' || s === 'REJETEE';
  }
}
