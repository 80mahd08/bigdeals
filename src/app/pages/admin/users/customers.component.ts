import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminUsersService } from 'src/app/core/services/admin-users.service';
import { AdminUserListItem } from 'src/app/core/models/admin-user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss'],
    standalone: false
})
export class CustomersComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;
  
  // Table data
  userList: AdminUserListItem[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  
  // Filters
  searchTerm = '';
  status: any = '';
  role: any = '';
  ville: any = '';
  
  villes: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 
    'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia', 'Manouba', 'Medenine', 
    'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];
  
  loading = false;
  imageBaseUrl = environment.imageBaseUrl;
  imageErrors = new Set<number>();
  private searchSubject = new Subject<string>();

  constructor(
    private modalService: NgbModal,
    private adminUsersService: AdminUsersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Gestion des utilisateurs', active: true }
    ];

    // Initialize from URL
    this.route.queryParams.subscribe(params => {
      this.pageNumber = params['page'] ? parseInt(params['page']) : 1;
      this.searchTerm = params['q'] || '';
      this.status = params['status'] || '';
      this.role = params['role'] || '';
      this.ville = params['ville'] || '';
      this.loadUsers();
    });

    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchTerm = value;
      this.pageNumber = 1;
      this.updateUrl();
    });
  }

  loadUsers() {
    this.loading = true;
    const params = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      statutCompte: this.status !== '' ? parseInt(this.status) : undefined,
      role: this.role !== '' ? parseInt(this.role) : undefined,
      ville: this.ville || undefined
    };

    this.adminUsersService.getUsers(params).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.userList = response.data.items;
          this.totalCount = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Swal.fire('Erreur', 'Impossible de charger les utilisateurs.', 'error');
      }
    });
  }

  updateUrl() {
    const queryParams: any = {};
    if (this.pageNumber > 1) queryParams.page = this.pageNumber;
    if (this.searchTerm) queryParams.q = this.searchTerm;
    if (this.status !== '') queryParams.status = this.status;
    if (this.role !== '') queryParams.role = this.role;
    if (this.ville !== '') queryParams.ville = this.ville;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: null // Replace old params
    });
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.updateUrl();
  }

  performSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  statusFilter() {
    this.pageNumber = 1;
    this.updateUrl();
  }

  roleFilter() {
    this.pageNumber = 1;
    this.updateUrl();
  }

  villeFilter() {
    this.pageNumber = 1;
    this.updateUrl();
  }

  resetFilters() {
    this.searchTerm = '';
    this.status = '';
    this.role = '';
    this.ville = '';
    this.pageNumber = 1;
    this.updateUrl();
  }

  toggleUserStatus(user: AdminUserListItem) {
    const isBlocked = user.statutCompte === 2;
    const action = isBlocked ? 'débloquer' : 'bloquer';
    const confirmButtonText = isBlocked ? 'Débloquer' : 'Bloquer';
    const confirmButtonColor = isBlocked ? '#34c38f' : '#f46a6a';

    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment ${action} cet utilisateur ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: '#74788d',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        const obs = isBlocked ? 
          this.adminUsersService.unblockUser(user.idUtilisateur) : 
          this.adminUsersService.blockUser(user.idUtilisateur);

        obs.subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire('Succès', `Utilisateur ${action} avec succès.`, 'success');
              this.loadUsers();
            }
          },
          error: (err) => {
            Swal.fire('Erreur', err.error?.message || `Une erreur est survenue lors de l'action.`, 'error');
          }
        });
      }
    });
  }

  // Helper for pagination display
  get startIndex(): number {
    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalCount);
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
