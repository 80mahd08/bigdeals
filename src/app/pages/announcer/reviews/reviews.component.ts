import { Component, OnInit } from '@angular/core';
import { AnnouncerDashboardService } from '../../../core/services/announcer-dashboard.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: [],
  standalone: false
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  averageRating = 0;
  isLoading = true;

  constructor(private announcerService: AnnouncerDashboardService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.announcerService.getAnnouncerReviews().subscribe({
      next: (data: any[]) => {
        this.reviews = data;
        this.calculateAverage();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.isLoading = false;
        this.reviews = [];
      }
    });
  }

  calculateAverage(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews.reduce((acc, r) => acc + r.note, 0);
    this.averageRating = sum / this.reviews.length;
  }

  reportReview(review: any): void {
    // Placeholder for future feature
    console.log('Reporting review:', review.idAvis);
    alert('Ce signalement sera traité prochainement par notre équipe de modération.');
  }
}
