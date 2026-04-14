import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { User } from 'src/app/store/Authentication/auth.models';
import { environment } from 'src/environments/environment';
import { logout } from 'src/app/store/Authentication/authentication.actions';

/**
 * AuthenticationService
 *
 * This service handles authentication by communicating with the custom ASP.NET Core API.
 * It manages the current user state using a BehaviorSubject and persists the JWT in sessionStorage.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  // BehaviorSubject tracking the currently authenticated user (from sessionStorage on startup)
  private currentUserSubject: BehaviorSubject<User | null>;

  // Public observable that any component can subscribe to for the current user
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private store: Store
  ) {
    // Restore user from sessionStorage if a previous session exists (e.g. after page refresh)
    const storedUser = sessionStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Returns the currently authenticated user value (synchronously).
   */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Register a new user with the backend API.
   *
   * @param email    - New user's email
   * @param username - New user's username
   * @param password - New user's password
   */
  register(email: string, username: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/api/account/register`, {
      email,
      username,
      password
    }).pipe(
      map((response) => {
        // Map backend NewUserDto to our internal User model
        const user: User = {
          email: response.email,
          username: response.userName,
          token: response.token,
          role: response.roles && response.roles.length > 0 ? response.roles[0] : 'CLIENT',
        };
        return user;
      }),
      tap((user) => {
        // Persist user and token
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('token', user.token!);
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Sign in an existing user with the backend API.
   *
   * @param email    - The user's email
   * @param password - The user's password
   */
  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/api/account/login`, {
      email,
      password
    }).pipe(
      map((response) => {
        // Map backend NewUserDto to our internal User model
        const user: User = {
          email: response.email,
          username: response.userName,
          token: response.token,
          role: response.roles && response.roles.length > 0 ? response.roles[0] : 'CLIENT',
        };
        return user;
      }),
      tap((user) => {
        // Save authenticated user and token
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('token', user.token!);
        this.currentUserSubject.next(user);
        sessionStorage.setItem('toast', 'true');
      })
    );
  }

  /**
   * Sign out the current user and clear all local session data.
   */
  logout(): Observable<void> {
    return this.http.post(`${environment.apiUrl}/api/account/logout`, {}).pipe(
      map(() => undefined as void),
      catchError(() => of(undefined as void)),
      tap(() => {
        // Dispatch NgRx logout action to reset state
        this.store.dispatch(logout());
        // Clear all session data
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('toast');
        // Reset the local subject to null
        this.currentUserSubject.next(null);
      })
    );
  }

  /**
   * Placeholder for password reset (to be implemented on backend)
   */
  resetPassword(email: string): Observable<void> {
    // Currently not implemented on backend
    return of(undefined);
  }
}
