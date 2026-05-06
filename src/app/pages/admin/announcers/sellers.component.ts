import { Component, OnInit } from '@angular/core';
import { AdminDemandesAnnonceurService } from 'src/app/core/services/admin-demandes-annonceur.service';
import { DemandeAnnonceur } from 'src/app/core/models';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-sellers',
    templateUrl: './sellers.component.html',
    styleUrls: ['./sellers.component.scss'],
    standalone: false
})
export class SellersComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  requests: DemandeAnnonceur[] = [];
  loading = false;

  constructor(private adminService: AdminDemandesAnnonceurService) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Administration' },
      { label: "Demandes d'annonceurs", active: true }
    ];
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.adminService.getAllRequests().subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.requests = res.data.sort((a: any, b: any) => new Date(b.dateDemande).getTime() - new Date(a.dateDemande).getTime());
        }
      },
      error: () => {
        this.loading = false;
        Swal.fire('Erreur', 'Impossible de charger les demandes.', 'error');
      }
    });
  }

  viewDocument(id: number) {
    this.adminService.getDocument(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

  approve(id: number) {
    Swal.fire({
      title: 'Approuver la demande ?',
      text: "L'utilisateur deviendra un annonceur actif.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, approuver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.approveRequest(id).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('Approuvé', 'La demande a été approuvée avec succès.', 'success');
            this.loadRequests();
          } else {
            Swal.fire('Erreur', res.message || 'Une erreur est survenue.', 'error');
          }
        });
      }
    });
  }

  reject(id: number) {
    Swal.fire({
      title: 'Rejeter la demande',
      input: 'textarea',
      inputLabel: 'Motif du rejet',
      inputPlaceholder: 'Entrez la raison du rejet...',
      inputAttributes: {
        'aria-label': 'Entrez la raison du rejet'
      },
      showCancelButton: true,
      confirmButtonText: 'Rejeter',
      cancelButtonText: 'Annuler',
      inputValidator: (value) => {
        if (!value) {
          return 'Vous devez spécifier un motif !';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.rejectRequest(id, result.value).subscribe((res: any) => {
          if (res.success) {
            Swal.fire('Rejeté', 'La demande a été rejetée.', 'success');
            this.loadRequests();
          } else {
            Swal.fire('Erreur', res.message || 'Une erreur est survenue.', 'error');
          }
        });
      }
    });
  }
}
