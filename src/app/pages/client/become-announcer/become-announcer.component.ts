import { Component, OnInit } from '@angular/core';
import { ClientActionsService } from '../../../core/services/client-actions.service';
import { DemandeAnnonceur } from '../../../core/models';
import { Observable, BehaviorSubject, switchMap, of, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-become-announcer',
  templateUrl: './become-announcer.component.html',
  styleUrls: ['./become-announcer.component.scss'],
  standalone: false
})
export class BecomeAnnouncerComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  public refresh$ = new BehaviorSubject<void>(undefined);
  existingRequest$: Observable<DemandeAnnonceur | null>;
  
  selectedFile: File | null = null;
  uploading = false;
  showForm = false;
  loading = true;

  constructor(
    private clientActions: ClientActionsService,
    private authService: AuthenticationService
  ) {
    this.existingRequest$ = this.refresh$.pipe(
      switchMap(() => {
        this.loading = true;
        return this.clientActions.getAdvertiserRequests().pipe(
          catchError(err => {
            this.loading = false;
            console.error('Error fetching advertiser requests', err);
            return of({ success: false, data: [] as DemandeAnnonceur[] });
          })
        );
      }),
      map(res => {
        this.loading = false;
        if (res.success && res.data && res.data.length > 0) {
          const latest = [...res.data].sort((a, b) => new Date(b.dateDemande).getTime() - new Date(a.dateDemande).getTime())[0];
          this.showForm = false;
          return latest;
        }
        this.showForm = true;
        return null;
      })
    );
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Marketplace' },
      { label: 'Devenir Annonceur', active: true }
    ];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Erreur', 'Le fichier est trop volumineux (max 5 Mo).', 'error');
        event.target.value = '';
        return;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Erreur', 'Format de fichier non supporté (PDF, JPG, PNG, WEBP uniquement).', 'error');
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      Swal.fire('Erreur', 'Veuillez sélectionner un document justificatif.', 'error');
      return;
    }

    this.uploading = true;
    this.clientActions.submitAdvertiserRequest(this.selectedFile).subscribe({
      next: (res) => {
        this.uploading = false;
        if (res.success) {
          Swal.fire('Succès', 'Votre demande a été envoyée avec succès.', 'success').then(() => {
            this.refresh$.next();
          });
        } else {
          Swal.fire('Erreur', res.message || 'Une erreur est survenue.', 'error');
        }
      },
      error: (err) => {
        this.uploading = false;
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'envoi.', 'error');
      }
    });
  }

  initiatePayment(demandeId: number) {
    this.uploading = true;
    this.clientActions.initiatePayment(demandeId).subscribe({
      next: (res) => {
        this.uploading = false;
        if (res.success && res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        } else if (res.success) {
          Swal.fire('Paiement', 'Redirection vers la page de paiement...', 'info');
        } else {
          Swal.fire('Erreur', res.message || 'Impossible d\'initier le paiement.', 'error');
        }
      },
      error: (err) => {
        this.uploading = false;
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'initialisation du paiement.', 'error');
      }
    });
  }

  resubmit() {
    this.showForm = true;
  }

  downloadDocument() {
    this.clientActions.getMyLatestAdvertiserDocument().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'justificatif_annonceur';
      link.click();
    });
  }

  // --- STATUS HELPERS ---

  getStatusLabel(statut: number | string): string {
    const s = statut?.toString();
    switch (s) {
      case '1':
      case 'EN_ATTENTE_VERIFICATION':
        return 'En cours de vérification';
      case '2':
      case 'APPROUVEE':
        return 'Approuvée';
      case '3':
      case 'REJETEE':
        return 'Rejetée';
      case '4':
      case 'EN_ATTENTE_PAIEMENT':
        return 'En attente de paiement';
      default:
        return 'Inconnu';
    }
  }

  getStatusClass(statut: number | string): string {
    const s = statut?.toString();
    switch (s) {
      case '1':
      case 'EN_ATTENTE_VERIFICATION':
        return 'bg-info';
      case '2':
      case 'APPROUVEE':
        return 'bg-success';
      case '3':
      case 'REJETEE':
        return 'bg-danger';
      case '4':
      case 'EN_ATTENTE_PAIEMENT':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  isWaitingVerification(statut: number | string): boolean {
    const s = statut?.toString();
    return s === '1' || s === 'EN_ATTENTE_VERIFICATION';
  }

  isApproved(statut: number | string): boolean {
    const s = statut?.toString();
    return s === '2' || s === 'APPROUVEE';
  }

  isRejected(statut: number | string): boolean {
    const s = statut?.toString();
    return s === '3' || s === 'REJETEE';
  }

  isWaitingPayment(statut: number | string): boolean {
    const s = statut?.toString();
    return s === '4' || s === 'EN_ATTENTE_PAIEMENT';
  }
}

