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
  logout,
  logoutSuccess
} from './authentication.actions';

/**
 * AuthenticationEffects
 *
 * NgRx Effects listen to dispatched actions and handle side-effects such as
 * making API calls and managing navigation.
 */
@Injectable()
export class AuthenticationEffects {

  /**
   * Register$ Effect
   */
  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, first_name, password }) =>
        // Mapping first_name to username as expected by the backend RegisterDto
        this.authService.register(email, first_name, password).pipe(
          map((user) => {
            this.router.navigate(['/auth/signin']);
            return RegisterSuccess({ user });
          }),
          catchError((error) => {
            const errorMessage = this.extractErrorMessage(error);
            return of(RegisterFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  /**
   * login$ Effect
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((user) => {
            this.router.navigate(['/']);
            return loginSuccess({ user });
          }),
          catchError((error) => {
            const errorMessage = this.extractErrorMessage(error);
            return of(loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  /**
   * logout$ Effect
   */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          tap(() => {
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
   * Extracts a human-readable error message from the backend HttpErrorResponse.
   */
  private extractErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Impossible de se connecter au serveur. Vérifiez que l\'API est en cours d\'exécution.';
    }

    if (error.error) {
      // If the error is a simple string (e.g., return Unauthorized("Invalid credentials"))
      if (typeof error.error === 'string') {
        return error.error;
      }
      
      // If the error is an array of messages (e.g., Identity error result)
      if (Array.isArray(error.error)) {
        return error.error.join(' ');
      }

      // If it's a validation error object (ModelState)
      if (typeof error.error === 'object') {
        return 'Une erreur de validation est survenue. Veuillez vérifier vos informations.';
      }
    }

    return 'Une erreur inattendue est survenue. Veuillez réessayer.';
  }
}