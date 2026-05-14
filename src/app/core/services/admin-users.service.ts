import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, PagedResponse } from '../types/api.types';
import { AdminUserListItem } from '../models/admin-user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) { }

  getUsers(params: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    statutCompte?: number;
    role?: number;
    ville?: string;
  }): Observable<ApiResponse<PagedResponse<AdminUserListItem>>> {
    let httpParams = new HttpParams();
    
    if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.statutCompte !== undefined && params.statutCompte !== null) 
      httpParams = httpParams.set('statutCompte', params.statutCompte.toString());
    if (params.role !== undefined && params.role !== null) 
      httpParams = httpParams.set('role', params.role.toString());
    if (params.ville) httpParams = httpParams.set('ville', params.ville);

    return this.http.get<ApiResponse<PagedResponse<AdminUserListItem>>>(this.apiUrl, { params: httpParams });
  }

  blockUser(id: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}/block`, {});
  }

  unblockUser(id: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}/unblock`, {});
  }
}
