import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { User } from 'src/app/store/Authentication/auth.models';
import { FirebaseService } from './firebase.service';
import { logout } from 'src/app/store/Authentication/authentication.actions';

/**
 * AuthenticationService
 *
 * This service is the bridge between the NgRx store/effects and the Firebase SDK.
 * All authentication operations are delegated to FirebaseService and the results
 * are mapped to our internal User model for use throughout the application.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  // BehaviorSubject tracking the currently authenticated user (from sessionStorage on startup)
  private currentUserSubject: BehaviorSubject<User | null>;

  // Public observable that any component can subscribe to for the current user
  public currentUser$: Observable<User | null>;

  constructor(
    private firebaseService: FirebaseService,
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
   * Register a new user with Firebase using email and password.
   * On success, maps the Firebase user to our internal User model and saves it to sessionStorage.
   *
   * @param email     - New user's email
   * @param firstName - New user's display name (stored locally; Firebase doesn't require this)
   * @param password  - New user's password
   */
  register(email: string, firstName: string, password: string): Observable<User> {
    return this.firebaseService.register(email, password).pipe(
      map((credential) => {
        // Map Firebase UserCredential to our internal User model
        const user: User = {
          email: credential.user.email ?? email,
          firstName: firstName,
          token: undefined, // Firebase token is retrieved asynchronously via getIdToken()
          username: firstName,
          role: 'CLIENT', // Default role for new registrations
        };
        return user;
      }),
      tap((user) => {
        // Persist user in sessionStorage so the session survives a page refresh
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Sign in an existing user with Firebase using email and password.
   * On success, retrieves the Firebase ID token and saves it to sessionStorage.
   *
   * @param email    - The user's email
   * @param password - The user's password
   */
  login(email: string, password: string): Observable<User> {
    return this.firebaseService.signIn(email, password).pipe(
      map((credential) => {
        // Map Firebase UserCredential to our internal User model
        const user: User = {
          email: credential.user.email ?? email,
          username: credential.user.displayName ?? email,
          token: undefined, // Firebase ID token is obtained asynchronously
          role: email.includes('admin') ? 'ADMIN' : 'CLIENT', // Simple role mapping for now
        };
        return user;
      }),
      tap((user) => {
        // Save authenticated user to sessionStorage and update BehaviorSubject
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        sessionStorage.setItem('toast', 'true'); // Flag telling the dashboard to show a welcome toast
      })
    );
  }

  /**
   * Sign in using Google.
   * On success, retrieves the Google user info and saves it to sessionStorage.
   */
  googleLogin(): Observable<User> {
    return this.firebaseService.signInWithGoogle().pipe(
      map((credential) => {
        // Map Firebase UserCredential to our internal User model
        const user: User = {
          email: credential.user.email ?? '',
          username: credential.user.displayName ?? credential.user.email ?? '',
          token: undefined, // Firebase ID token is obtained asynchronously
          profilePhoto: credential.user.photoURL ?? undefined,
          role: 'CLIENT', // Google login defaults to CLIENT
        };
        return user;
      }),
      tap((user) => {
        // Save authenticated user to sessionStorage and update BehaviorSubject
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        sessionStorage.setItem('toast', 'true'); // Flag telling the dashboard to show a welcome toast
      })
    );
  }

  /**
   * Sign out the current user from Firebase and clear all local session data.
   */
  logout(): Observable<void> {
    return this.firebaseService.signOut().pipe(
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
   * Send a password reset email to the given address via Firebase.
   *
   * @param email - The email address to send the reset link to
   */
  resetPassword(email: string): Observable<void> {
    return this.firebaseService.resetPassword(email);
  }

  /**
   * Returns the current user from Firebase (or null if not signed in).
   */
  getCurrentFirebaseUser() {
    return this.firebaseService.getCurrentUser();
  }
}
