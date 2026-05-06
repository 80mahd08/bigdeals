import { Component, OnInit } from '@angular/core';
import { AnnouncerDashboardService } from '../../../core/services/announcer-dashboard.service';
import { Annonce } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  stats: any[] = [];
  recentAds: Annonce[] = [];
  isLoading = true;

  constructor(private announcerService: AnnouncerDashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.announcerService.getDashboardStats().subscribe((res: any) => {
      this.stats = res;
      this.announcerService.getMyAnnouncements().subscribe((ads: Annonce[]) => {
        this.recentAds = ads.slice(0, 5); // Take top 5
        this.isLoading = false;
      });
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
