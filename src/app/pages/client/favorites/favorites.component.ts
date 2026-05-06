import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../../core/services/favorites.service';
import { Annonce } from '../../../core/models';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TUNISIA_CITIES } from '../../../core/constants/cities';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: false
})
export class FavoritesComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  favorites: Annonce[] = [];
  searchTerm: string = '';
  loading = true;
  selectedCity: string = '';
  cities = TUNISIA_CITIES;
  
  currentPage = 1;
  pageSize = 8;
  totalItems = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Marketplace' },
      { label: 'Mes Favoris', active: true }
    ];
    this.loadFavorites();
    this.subscribeToFavoriteChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFavoriteChanges() {
    this.favoritesService.favoritesIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ids => {
        // If we are not loading, and the IDs list changed, filter our local list
        if (!this.loading && this.favorites.length > 0) {
          this.favorites = this.favorites.filter(ad => ids.includes(ad.idAnnonce));
        }
      });
  }

  loadFavorites() {
    this.loading = true;
    this.favoritesService.getFavorites(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        console.log('Favorites API Response:', res);
        if (res.success && res.data) {
          // Handle paged response with either camelCase or PascalCase properties
          this.favorites = res.data.items || res.data.Items || (Array.isArray(res.data) ? res.data : []);
          this.totalItems = res.data.totalCount || res.data.TotalCount || this.favorites.length;
          console.log('Extracted favorites:', this.favorites);
        } else {
          this.favorites = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching favorites', err);
        this.favorites = [];
        this.loading = false;
      }
    });
  }

  removeFavorite(idAnnonce: number) {
    this.favoritesService.toggleFavorite(idAnnonce);
    // Optimistic UI or wait for reload
    this.favorites = this.favorites.filter(a => a.idAnnonce !== idAnnonce);
  }

  get filteredFavorites(): Annonce[] {
    let filtered = this.favorites;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(ad => 
        ad.titre.toLowerCase().startsWith(term) || 
        ad.categorieNom?.toLowerCase().includes(term)
      );
    }

    if (this.selectedCity) {
      filtered = filtered.filter(ad => ad.ville === this.selectedCity);
    }

    return filtered;
  }

  onPageChange(page: number) {
    if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) return;
    this.currentPage = page;
    this.loadFavorites();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

}
