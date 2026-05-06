import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './auth.service';
import { Annonce, ApiResponse } from '../models';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesIdsSubject = new BehaviorSubject<number[]>([]);
  public favoritesIds$ = this.favoritesIdsSubject.asObservable();

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient
  ) {
    this.authService.currentUser$.subscribe(user => {
        if (user) {
            this.loadFavoritesIds();
        } else {
            this.favoritesIdsSubject.next([]);
        }
    });
  }

  private loadFavoritesIds(): void {
    console.log('Loading favorite IDs...');
    this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/Favorites/ids`).subscribe({
        next: (res) => {
            if (res.success && res.data) {
                // Ensure all IDs are numbers to avoid type mismatch issues
                const numericIds = res.data.map(id => Number(id));
                console.log('Favorites loaded (numeric):', numericIds);
                this.favoritesIdsSubject.next(numericIds);
            }
        },
        error: (err) => console.error('Error loading favorites:', err)
    });
  }

  getFavorites(page: number = 1, pageSize: number = 8): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrl}/users/me/favorites?pageNumber=${page}&pageSize=${pageSize}`);
  }

  toggleFavorite(idAnnonce: number): void {
    const user = this.authService.currentUserValue;
    if (!user) return;

    const ids = this.favoritesIdsSubject.value;
    const isFav = ids.includes(idAnnonce);

    if (isFav) {
        this.http.delete(`${environment.apiUrl}/Favorites/${idAnnonce}`).subscribe({
            next: () => {
                const newIds = ids.filter(id => id !== idAnnonce);
                this.favoritesIdsSubject.next(newIds);
            },
            error: (err) => console.error('Error removing favorite:', err)
        });
    } else {
        this.http.post(`${environment.apiUrl}/Favorites/${idAnnonce}`, {}).subscribe({
            next: () => {
                const newIds = [...ids, idAnnonce];
                this.favoritesIdsSubject.next(newIds);
            },
            error: (err) => console.error('Error adding favorite:', err)
        });
    }
  }

  isFavorite(idAnnonce: number): boolean {
    return this.favoritesIdsSubject.value.includes(idAnnonce);
  }
}
