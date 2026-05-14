import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnoncesService } from '../../../core/services/annonces.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { ClientActionsService } from '../../../core/services/client-actions.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { Annonce, Categorie } from '../../../core/models';
import { TypeSignalement } from '../../../core/enums';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/store/Authentication/auth.models';
import { CartService } from '../../../core/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.scss'],
  standalone: false
})
export class AdDetailComponent implements OnInit, OnDestroy {
  ad?: Annonce;
  relatedAds: Annonce[] = [];
  categorie?: Categorie;
  isLoading = true;
  hasError = false;
  currentMainImage = '';
  imageBaseUrl = environment.imageBaseUrl || 'http://localhost:5049';
  currentUser: User | null = null;
  avisList: any[] = [];
  totalAvisCount: number = 0;
  currentAvisPage: number = 1;
  avisPageSize: number = 5;
  myAvis: any = null;
  newCommentaire: string = '';
  selectedNote: number = 5; // Default to 5 stars
  isEditingAvis: boolean = false;
  isSubmittingAvis: boolean = false;
  
  private destroy$ = new Subject<void>();

  reportTypes = Object.values(TypeSignalement);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annoncesService: AnnoncesService,
    private favoritesService: FavoritesService,
    private clientActions: ClientActionsService,
    private authService: AuthenticationService,
    private categoriesService: CategoriesService,
    private modalService: NgbModal,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadAd(id);
      }
    });

    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAd(id: number): void {
    this.isLoading = true;
    this.hasError = false;
    this.annoncesService.getAnnonceById(id).subscribe(res => {
      this.isLoading = false;
      if (res.success && res.data) {
        this.ad = res.data;
        // Fallback to first image if mainImageUrl is not provided by the API
        this.currentMainImage = this.ad.mainImageUrl || (this.ad.images && this.ad.images.length > 0 ? this.ad.images[0].url : '');
        this.loadRelatedAds(this.ad.idCategorie);
        this.loadCategory(this.ad.idCategorie);
        this.loadAvis(this.ad.idAnnonce);
      } else {
        this.hasError = true;
      }
    }, () => {
      this.isLoading = false;
      this.hasError = true;
    });
  }

  private loadCategory(categoryId?: number): void {
    if (categoryId) {
      this.categoriesService.getCategories().subscribe(res => {
        if (res.success && res.data) {
          this.categorie = (res.data as any[]).find(c => c.idCategorie === categoryId);
        }
      });
    }
  }

  private loadRelatedAds(categoryId?: number): void {
    this.annoncesService.getAnnonces(undefined, categoryId).subscribe(res => {
      if (res.success && res.data) {
        this.relatedAds = res.data.items.filter((a: Annonce) => a.idAnnonce !== this.ad?.idAnnonce).slice(0, 4);
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isOwner(): boolean {
    if (!this.currentUser || !this.ad) return false;
    return this.currentUser.idUtilisateur === this.ad.idUtilisateur;
  }

  get canSeeBuyerActions(): boolean {
    return this.isLoggedIn && !this.isOwner;
  }

  isFavorite(): boolean {
    return this.ad ? this.favoritesService.isFavorite(this.ad.idAnnonce) : false;
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/signin']);
      return;
    }
    if (this.ad) {
      this.favoritesService.toggleFavorite(this.ad.idAnnonce);
    }
  }

  addToCart(): void {
    if (this.ad) {
      this.cartService.addToCart(this.ad);
      Swal.fire({
        title: 'Ajouté au panier !',
        text: `${this.ad.titre} a été ajouté à votre panier.`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  }

  buyNow(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/signin']);
      return;
    }
    if (this.ad) {
      this.router.navigate(['/client/product-checkout', this.ad.idAnnonce]);
    }
  }

  contactWhatsapp(): void {
    if (this.ad && this.ad.annonceurTelephone) {
      this.clientActions.logContactEvent(this.ad.idAnnonce, 'WHATSAPP').subscribe();
      const phone = this.formatPhoneForWhatsapp(this.ad.annonceurTelephone);
      window.open(`https://wa.me/${phone}?text=Bonjour, je suis intéressé par votre annonce : ${this.ad.titre}`, '_blank');
    }
  }

  private formatPhoneForWhatsapp(phone: string): string {
    // Remove spaces and non-digits
    let cleaned = phone.replace(/\D/g, '');
    // If 8 digits (Tunisia standard), prefix with 216
    if (cleaned.length === 8) {
      cleaned = '216' + cleaned;
    }
    return cleaned;
  }

  contactPhone(): void {
    if (this.ad) {
      this.clientActions.logContactEvent(this.ad.idAnnonce, 'PHONE').subscribe();
      const phone = this.ad.annonceurTelephone || '21699000000';
      window.location.href = `tel:${phone}`;
    }
  }

  openReportModal(content: any): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/signin']);
      return;
    }
    this.modalService.open(content, { centered: true });
  }

  submitReport(type: string, motif: string, modal: any): void {
    if (this.ad) {
      this.clientActions.submitReport({
        idAnnonceSignalee: this.ad.idAnnonce,
        motif: motif
      }).subscribe(() => {
        modal.close();
        Swal.fire('Signalement envoyé', 'Merci de nous aider à garder la plateforme sûre.', 'success');
      });
    }
  }

  getImageUrl(url?: string): string {
    return url || '';
  }

  onImageError(event: any): void {
    event.target.src = '';
  }

  setMainImage(url: string): void {
    this.currentMainImage = url;
  }

  getAttributeLabel(attrId: number): string {
    // This will be replaced by real labels from dynamic attributes
    return 'Caractéristique';
  }

  // --- AVIS LOGIC ---
  loadAvis(idAnnonce: number, page: number = 1): void {
    this.currentAvisPage = page;
    this.clientActions.getAvis(idAnnonce, page, this.avisPageSize).subscribe(res => {
      if (res.success && res.data) {
        const pagedData = res.data;
        this.totalAvisCount = pagedData.totalCount;
        this.avisList = (pagedData.items || []).map((a: any) => ({
          ...a,
          photoProfilUrl: a.photoProfilUrl ? (a.photoProfilUrl.startsWith('http') ? a.photoProfilUrl : this.imageBaseUrl + a.photoProfilUrl) : null
        }));
        this.checkMyAvis();
      }
    });
  }

  onAvisPageChange(page: number): void {
    if (this.ad) {
      this.loadAvis(this.ad.idAnnonce, page);
    }
  }

  private checkMyAvis(): void {
    if (this.currentUser && this.avisList.length > 0) {
      this.myAvis = this.avisList.find(a => a.idUtilisateur === this.currentUser?.idUtilisateur);
      if (this.myAvis) {
        this.newCommentaire = this.myAvis.commentaire;
        this.selectedNote = this.myAvis.note;
      }
    } else {
      this.myAvis = null;
    }
  }

  submitAvis(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/signin']);
      return;
    }

    if (!this.newCommentaire.trim()) return;

    this.isSubmittingAvis = true;
    const action = this.myAvis 
      ? this.clientActions.updateAvis(this.ad!.idAnnonce, this.selectedNote, this.newCommentaire)
      : this.clientActions.createAvis(this.ad!.idAnnonce, this.selectedNote, this.newCommentaire);

    action.subscribe({
      next: (res) => {
        this.isSubmittingAvis = false;
        this.isEditingAvis = false;
        if (res.success) {
          Swal.fire('Succès', res.message || 'Votre avis a été enregistré.', 'success');
          this.loadAvis(this.ad!.idAnnonce);
        }
      },
      error: (err) => {
        this.isSubmittingAvis = false;
        const errorMsg = err.error?.message || 'Une erreur est survenue lors de la publication de votre avis.';
        Swal.fire('Erreur', errorMsg, 'error');
      }
    });
  }

  deleteAvis(): void {
    if (!this.ad) return;

    Swal.fire({
      title: 'Supprimer l\'avis ?',
      text: 'Êtes-vous sûr de vouloir supprimer votre avis ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.clientActions.deleteAvis(this.ad!.idAnnonce).subscribe(res => {
          if (res.success) {
            Swal.fire('Supprimé', 'Votre avis a été supprimé.', 'success');
            this.newCommentaire = '';
            this.loadAvis(this.ad!.idAnnonce);
          }
        });
      }
    });
  }

  startEditing(): void {
    this.isEditingAvis = true;
    this.newCommentaire = this.myAvis.commentaire;
    this.selectedNote = this.myAvis.note;
  }

  cancelEditing(): void {
    this.isEditingAvis = false;
    this.newCommentaire = this.myAvis.commentaire;
    this.selectedNote = this.myAvis.note;
  }

  setNote(note: number): void {
    this.selectedNote = note;
  }
}
