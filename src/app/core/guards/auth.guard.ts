import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';

/**
 * AuthGuard
 * 
 * Protects routes by checking if the user is authenticated.
 * If the user is logged in, the route can be activated.
 * Otherwise, redirects the user to the sign-in page.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // We check the AuthenticationService first as it's the source of truth for the app state
        const currentUser = this.authenticationService.currentUserValue;
        
        if (currentUser && currentUser.token) {
            // logged in so return true
            return true;
        }

        // Secondary check: check if user data is in storage directly (e.g. after refresh before service init)
        if (localStorage.getItem('currentUser') && localStorage.getItem('token')) {
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
