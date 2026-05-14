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

@Injectable()
export class AuthenticationEffects {

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, prenom, nom, password }) =>
        this.authService.register(email, prenom, nom, password).pipe(
          map((user) => {
            this.router.navigate(['/']);
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

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((user) => {
            if (user.role === 'ADMIN') {
                this.router.navigate(['/admin']);
            } else {
                this.router.navigate(['/']);
            }
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

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          tap(() => {
            this.router.navigate(['/']);
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

  private extractErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Impossible de se connecter au serveur. Vérifiez que l\'API est en cours d\'exécution.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      
      if (Array.isArray(error.error)) {
        return error.error.join(' ');
      }

      if (typeof error.error === 'object') {
        if (error.error.message) return error.error.message;
        return 'Une erreur de validation est survenue.';
      }
    }

    return 'Une erreur inattendue est survenue. Veuillez réessayer.';
  }
}