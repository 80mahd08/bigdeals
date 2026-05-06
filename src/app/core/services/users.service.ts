import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPage } from '../models/user.model';
import { environment } from '../../../environments/environment';

/**
 * @deprecated THIS SERVICE IS ORPHANED. 
 * Please use UtilisateursService instead for mock-ready Phase 2 architecture.
 * This file is kept only for reference until full migration is complete.
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/api/Users`;

  constructor(private http: HttpClient) {}

  getPageUserDetails(idUser: number): Observable<{ success: boolean; data: UserPage; message: string }> {
    return this.http.get<{ success: boolean; data: UserPage; message: string }>(`${this.apiUrl}/${idUser}/page`);
  }
}
