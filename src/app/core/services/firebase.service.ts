import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from, Observable } from 'rxjs';

/**
 * FirebaseService
 *
 * This service initializes Firebase and wraps all Firebase Authentication
 * operations (sign up, sign in, sign out, password reset) as RxJS Observables
 * so they can be used cleanly inside NgRx Effects.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseService {

  // The initialized Firebase application instance
  private app: FirebaseApp;

  // The Firebase Auth instance used for all authentication operations
  private auth: Auth;

  // Reactive stream of the currently authenticated Firebase user (null if logged out)
  currentFirebaseUser$ = new BehaviorSubject<FirebaseUser | null>(null);

  constructor() {
    // Initialize the Firebase app using the config from environment.ts
    this.app = initializeApp(environment.firebaseConfig);

    // Get the Auth service from the initialized Firebase app
    this.auth = getAuth(this.app);

    // Subscribe to Firebase's own auth state listener.
    // This fires whenever the user logs in or out, even on page refresh.
    onAuthStateChanged(this.auth, (user) => {
      this.currentFirebaseUser$.next(user);
    });
  }

  /**
   * Register a new user with email and password.
   * Returns an Observable wrapping the Firebase UserCredential Promise.
   *
   * @param email - The new user's email address
   * @param password - The new user's chosen password
   */
  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Sign in an existing user with email and password.
   * Returns an Observable wrapping the Firebase UserCredential Promise.
   *
   * @param email - The user's email address
   * @param password - The user's password
   */
  signIn(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Sign out the currently authenticated user.
   * Returns an Observable wrapping the Firebase signOut Promise.
   */
  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  /**
   * Send a password reset email to the given address.
   * Returns an Observable wrapping the Firebase sendPasswordResetEmail Promise.
   *
   * @param email - The email address to send the reset link to
   */
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  /**
   * Sign in using Google.
   * Returns an Observable wrapping the Firebase signInWithPopup Promise.
   */
  signInWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  /**
   * Returns the currently signed-in Firebase user, or null.
   */
  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }
}
