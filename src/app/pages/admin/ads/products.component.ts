import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAnnoncesService } from '../../../core/services/admin-annonces.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    standalone: false
})
export class ProductsComponent implements OnInit, OnDestroy {
  protected Math = Math;
  breadCrumbItems!: Array<{}>;
  annonces: any[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 10;
  loading = false;
  imageBaseUrl = environment.imageBaseUrl;
  imageErrors = new Set<number>();
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private adminAnnoncesService: AdminAnnoncesService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Administration' },
      { label: 'Gérer annonces', active: true }
    ];

    this.route.queryParams.subscribe(params => {
      this.pageNumber = params['page'] ? parseInt(params['page']) : 1;
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadAnnonces();
    });

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.pageNumber = 1;
      this.changePage();
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  performSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  loadAnnonces() {
    this.loading = true;
    this.adminAnnoncesService.getAnnonces(this.pageNumber, this.pageSize, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.annonces = res.data.items;
          this.totalCount = res.data.totalCount;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Erreur', 'Impossible de charger les annonces.', 'error');
      }
    });
  }

  changePage() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        page: this.pageNumber,
        search: this.searchQuery || null
      },
      queryParamsHandling: 'merge'
    });
  }

  toggleSuspension(annonce: any) {
    const isSuspended = annonce.statut === 'SUSPENDUE';
    const action = isSuspended ? 'rétablir' : 'suspendre';
    const confirmText = isSuspended ? 'Oui, rétablir' : 'Oui, suspendre';

    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment ${action} cette annonce ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        const obs = isSuspended ? 
          this.adminAnnoncesService.restoreAnnonce(annonce.idAnnonce) : 
          this.adminAnnoncesService.suspendAnnonce(annonce.idAnnonce);

        obs.subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire('Succès', `Annonce traitée avec succès.`, 'success');
              this.loadAnnonces();
            }
          },
          error: (err) => {
            Swal.fire('Erreur', err.error?.message || 'Une erreur est survenue.', 'error');
          }
        });
      }
    });
  }

  getPhotoUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${this.imageBaseUrl}${path}`;
  }

  onImageError(id: number) {
    this.imageErrors.add(id);
  }
}
