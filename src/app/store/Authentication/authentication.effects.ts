import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/auth.service';
import {
  Register,
  RegisterSuccess,
  RegisterFailure,
  login,
  loginSuccess,
  loginFailure,
  googleLogin,
  logout,
  logoutSuccess
} from './authentication.actions';

/**
 * AuthenticationEffects
 *
 * NgRx Effects listen to dispatched actions and handle side-effects such as
 * making Firebase API calls, navigating between routes, and managing sessionStorage.
 *
 * Effects are the correct place to do async work in the NgRx pattern.
 */
@Injectable()
export class AuthenticationEffects {

  /**
   * Register$ Effect
   *
   * Triggered by the `Register` action (dispatched from signup.component.ts).
   * Calls the AuthenticationService.register() method which communicates with Firebase,
   * then dispatches RegisterSuccess on success, or RegisterFailure on error.
   * On success, navigates the user to the sign-in page.
   */
  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, first_name, password }) =>
        this.authService.register(email, first_name, password).pipe(
          map((user) => {
            // Navigate to sign-in page after successful registration
            this.router.navigate(['/auth/signin']);
            return RegisterSuccess({ user });
          }),
          catchError((error) => {
            // Extract a readable error message from Firebase errors
            const errorMessage = this.extractErrorMessage(error);
            return of(RegisterFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  /**
   * login$ Effect
   *
   * Triggered by the `login` action (dispatched from signin.component.ts).
   * Calls the AuthenticationService.login() method which communicates with Firebase,
   * then dispatches loginSuccess on success, or loginFailure on error.
   * On success, navigates the user to the root route (home page / dashboard).
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((user) => {
            // Navigate to the root home page on successful sign-in
            this.router.navigate(['/']);
            return loginSuccess({ user });
          }),
          catchError((error) => {
            // Extract a readable error message from Firebase errors
            const errorMessage = this.extractErrorMessage(error);
            return of(loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  /**
   * googleLogin$ Effect
   *
   * Triggered by the `googleLogin` action.
   * Calls the AuthenticationService.googleLogin() method which communicates with Firebase,
   * then dispatches loginSuccess on success, or loginFailure on error.
   * On success, navigates the user to the root route.
   */
  googleLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(googleLogin),
      exhaustMap(() =>
        this.authService.googleLogin().pipe(
          map((user) => {
            // Navigate to the root home page on successful sign-in
            this.router.navigate(['/']);
            return loginSuccess({ user });
          }),
          catchError((error) => {
            // Extract a readable error message from Firebase errors
            const errorMessage = this.extractErrorMessage(error);
            return of(loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  /**
   * logout$ Effect
   *
   * Triggered by the `logout` action (dispatched from the topbar or logout component).
   * Calls the AuthenticationService.logout() method which signs out from Firebase,
   * clears sessionStorage, then navigates the user to the sign-in page.
   */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          tap(() => {
            // Navigate to sign-in page after successful logout
            this.router.navigate(['/auth/signin']);
          }),
          map(() => logoutSuccess())
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  /**
   * Helper method to convert Firebase error codes into human-readable messages.
   * Firebase throws errors with a `code` property like 'auth/wrong-password'.
   *
   * @param error - The error thrown by Firebase
   * @returns A user-friendly error string
   */
  private extractErrorMessage(error: any): string {
    if (error?.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'This email address is already registered.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/weak-password':
          return 'Password must be at least 6 characters.';
        case 'auth/user-not-found':
          return 'No account found with this email.';
        case 'auth/wrong-password':
          return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
          return 'Invalid email or password. Please try again.';
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }
    return error?.message || 'An unexpected error occurred.';
  }
}