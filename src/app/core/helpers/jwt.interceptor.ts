import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/auth.service';

/**
 * JwtInterceptor
 *
 * Automatically attaches the Firebase user's session token to every outgoing HTTP request.
 * This is useful if your backend API requires a Bearer token for protected endpoints.
 *
 * The token is read from localStorage where AuthenticationService stores it after login.
 * If the server returns a 401 (Unauthorized), the user is redirected to the sign-in page.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Read the stored token from localStorage
    const token = localStorage.getItem('token');

    // If a token exists, clone the request and add the Authorization header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        // If the server returns 401 Unauthorized, force the user to the sign-in page
        if (error.status === 401) {
          this.router.navigate(['/auth/signin']);
        }
        return throwError(() => error);
      })
    );
  }
}
