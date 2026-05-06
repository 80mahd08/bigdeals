import { Component, OnInit, OnDestroy } from '@angular/core';
import { Annonce } from '../../../core/models';
import { AnnouncerDashboardService } from '../../../core/services/announcer-dashboard.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: [],
  standalone: false
})
export class AnnouncementsComponent implements OnInit, OnDestroy {
  announcements: Annonce[] = [];
  isLoading = true;
  searchTerm: string = '';
  hasAds: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(
    private announcerService: AnnouncerDashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();

    // Debounce search to avoid too many API calls
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.loadAnnouncements();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadAnnouncements(): void {
    this.isLoading = true;
    this.announcerService.getMyAnnouncements(this.searchTerm).subscribe((ads: Annonce[]) => {
      this.announcements = ads;
      if (!this.searchTerm) {
        this.hasAds = ads.length > 0;
      }
      this.isLoading = false;
    });
  }

  onSearch(event: any): void {
    const term = event.target.value;
    this.searchSubject.next(term);
  }

  editAd(id: number | string): void {
    this.router.navigate([`/announcer/announcements/${id}/edit`]);
  }

  deleteAd(id: number | string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous supprimer définitivement cette annonce ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f06548',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.announcerService.deleteAnnouncement(id).subscribe(() => {
          Swal.fire('Supprimée !', 'L\'annonce a été supprimée définitivement.', 'success');
          this.loadAnnouncements();
        });
      }
    });
  }

  toggleStatus(ad: Annonce): void {
    const isPublishing = ad.statut !== 'PUBLIEE';
    const title = isPublishing ? 'Publier l\'annonce ?' : 'Suspendre l\'annonce ?';
    const text = isPublishing 
      ? 'Voulez-vous rendre cette annonce visible publiquement ?' 
      : 'Voulez-vous suspendre cette annonce ? Elle ne sera plus visible par les visiteurs.';

    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: isPublishing ? '#0ab39c' : '#f7b84b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: isPublishing ? 'Oui, publier' : 'Oui, suspendre',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        const action = isPublishing 
          ? this.announcerService.resumeAnnouncement(ad.idAnnonce)
          : this.announcerService.suspendAnnouncement(ad.idAnnonce);
        
        action.subscribe(() => {
          Swal.fire(
            isPublishing ? 'Publiée !' : 'Suspendue !',
            isPublishing ? 'L\'annonce est maintenant visible.' : 'L\'annonce a été suspendue.',
            'success'
          );
          this.loadAnnouncements();
        });
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PUBLIEE': return 'badge bg-success-subtle text-success';
      case 'SUSPENDUE': return 'badge bg-warning-subtle text-warning';
      default: return 'badge bg-light text-dark';
    }
  }
}
