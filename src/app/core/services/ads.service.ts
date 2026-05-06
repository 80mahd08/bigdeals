import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ad } from '../models/ad.model';
import { ApiResponse, PagedResponse } from '../types';
import { environment } from '../../../environments/environment';

/**
 * @deprecated THIS SERVICE IS ORPHANED. 
 * Please use AnnoncesService instead for mock-ready Phase 2 architecture.
 * This file is kept only for reference until full migration is complete.
 */
@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private apiUrl = `${environment.apiUrl}/api/Ads`;

  constructor(private http: HttpClient) {}

  searchAds(
    search?: string | null,
    idCategory?: number | null,
    minPrice?: string | null,
    maxPrice?: string | null,
    page: number = 1,
    pageSize: number = 20
  ): Observable<ApiResponse<PagedResponse<Ad>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) params = params.set('search', search);
    if (idCategory) params = params.set('idCategory', idCategory.toString());
    if (minPrice) params = params.set('minPrice', minPrice);
    if (maxPrice) params = params.set('maxPrice', maxPrice);

    return this.http.get<ApiResponse<PagedResponse<Ad>>>(`${this.apiUrl}/search`, { params });
  }

  getAdById(id: number): Observable<ApiResponse<Ad>> {
    return this.http.get<ApiResponse<Ad>>(`${this.apiUrl}/${id}`);
  }

  getRelatedAds(idCategory: number): Observable<ApiResponse<{ items: Ad[] }>> {
    return this.http.get<ApiResponse<{ items: Ad[] }>>(`${this.apiUrl}/related/${idCategory}`);
  }
}
