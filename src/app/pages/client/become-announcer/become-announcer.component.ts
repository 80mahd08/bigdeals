import { Component, OnInit } from '@angular/core';
import { ClientActionsService } from '../../../core/services/client-actions.service';
import { DemandeAnnonceur } from '../../../core/models';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';
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

  constructor(
    private clientActions: ClientActionsService,
    private authService: AuthenticationService
  ) {
    this.existingRequest$ = this.refresh$.pipe(
      switchMap(() => this.clientActions.getAdvertiserRequests()),
      map(res => {
        if (res.success && res.data && res.data.length > 0) {
          // Get the most recent request
          return res.data.sort((a, b) => new Date(b.dateDemande).getTime() - new Date(a.dateDemande).getTime())[0];
        }
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

  downloadDocument() {
    this.clientActions.getMyLatestAdvertiserDocument().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'justificatif_annonceur';
      link.click();
    });
  }
}

