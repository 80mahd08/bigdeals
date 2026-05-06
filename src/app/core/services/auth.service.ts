import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { User } from 'src/app/store/Authentication/auth.models';
import { logout as logoutAction } from 'src/app/store/Authentication/authentication.actions';
import { environment } from 'src/environments/environment';
import { AuthResponseDto } from '../models/utilisateur.model';
import { ApiResponse } from '../types/api.types';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private store: Store,
    private http: HttpClient
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  register(email: string, prenom: string, nom: string, password: string): Observable<User> {
    const formData = new FormData();
    formData.append('Prenom', prenom);
    formData.append('Nom', nom);
    formData.append('Email', email);
    formData.append('Password', password);
    formData.append('ConfirmPassword', password);
    formData.append('Role', '1'); // 1 = CLIENT

    return this.http.post<ApiResponse<AuthResponseDto>>(`${environment.apiUrl}/auth/register`, formData).pipe(
      map(response => {
        if (!response.success || !response.data) throw new Error(response.message || 'Registration failed');
        const dto = response.data.user;
        const user: User = {
          idUtilisateur: dto.idUtilisateur,
          email: dto.email,
          prenom: dto.prenom,
          nom: dto.nom,
          token: response.data.token,
          role: dto.role as any,
          photoProfilUrl: dto.photoProfilUrl,
          telephone: dto.telephone || (dto as any).Telephone,
          adresse: dto.adresse || (dto as any).Adresse,
          ville: dto.ville || (dto as any).Ville
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', user.token!);
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    const formData = new FormData();
    formData.append('Email', email);
    formData.append('Password', password);

    return this.http.post<ApiResponse<AuthResponseDto>>(`${environment.apiUrl}/auth/login`, formData).pipe(
      map(response => {
        if (!response.success || !response.data) throw new Error(response.message || 'Login failed');
        const dto = response.data.user;
        const user: User = {
          idUtilisateur: dto.idUtilisateur,
          email: dto.email,
          prenom: dto.prenom,
          nom: dto.nom,
          token: response.data.token,
          role: dto.role as any,
          photoProfilUrl: dto.photoProfilUrl,
          telephone: dto.telephone || (dto as any).Telephone,
          adresse: dto.adresse || (dto as any).Adresse,
          ville: dto.ville || (dto as any).Ville
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', user.token!);
        localStorage.setItem('toast', 'true');
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): Observable<void> {
    return of(undefined).pipe(
      delay(300),
      tap(() => {
        this.store.dispatch(logoutAction());
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('toast');
        this.currentUserSubject.next(null);
      })
    );
  }

  updateProfile(formData: FormData): Observable<User> {
    return this.http.put<ApiResponse<any>>(`${environment.apiUrl}/users/me`, formData).pipe(
      map(response => {
        if (!response.success || !response.data) throw new Error(response.message || 'Update failed');
        const dto = response.data;
        const user: User = {
          ...this.currentUserValue!,
          prenom: dto.prenom,
          nom: dto.nom,
          photoProfilUrl: dto.photoProfilUrl,
          email: dto.email,
          telephone: dto.telephone || (dto as any).Telephone,
          adresse: dto.adresse || (dto as any).Adresse,
          ville: dto.ville || (dto as any).Ville
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  resetPassword(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPasswordConfirm(token: string, newPassword: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/auth/reset-password`, { 
      token, 
      newPassword, 
      confirmPassword: newPassword 
    });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('AncienMotDePasse', oldPassword);
    formData.append('NouveauMotDePasse', newPassword);
    formData.append('ConfirmationMotDePasse', newPassword);
    return this.http.put<ApiResponse<any>>(`${environment.apiUrl}/users/me/password`, formData);
  }
}
