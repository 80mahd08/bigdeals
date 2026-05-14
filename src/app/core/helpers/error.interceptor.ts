import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * ErrorInterceptor
 *
 * A global HTTP error handler. Intercepts all HTTP responses and handles
 * common error scenarios such as 401 Unauthorized and 403 Forbidden.
 *
 * This keeps error handling logic in one place rather than duplicating it
 * across all individual service or component HTTP calls.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // 401 = Unauthorized: session expired or invalid token
          // Clear session and redirect to login
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          this.router.navigate(['/auth/signin']);
        }

        if (err.status === 403) {
          // 403 = Forbidden: user lacks permission for this resource
          this.router.navigate(['/auth/signin']);
        }

        // Extract the most meaningful error message from the response
        let errorMessage = 'Une erreur est survenue.';
        if (err?.error) {
          errorMessage = err.error.message || err.error.Message || err.statusText || errorMessage;
        } else {
          errorMessage = err.statusText || errorMessage;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
