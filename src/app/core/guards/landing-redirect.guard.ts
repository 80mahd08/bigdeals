import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

/**
 * LandingRedirectGuard
 * 
 * This guard is used on the root/landing route. 
 * If an ADMIN or ANNONCEUR is logged in, they should be redirected 
 * to their respective dashboards instead of seeing the public landing page.
 */
@Injectable({ providedIn: 'root' })
export class LandingRedirectGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUser = this.authService.currentUserValue;

        if (currentUser) {
            // If user is ADMIN, they MUST stay in the admin area
            if (currentUser.role === 'ADMIN') {
                this.router.navigate(['/admin']);
                return false;
            }

            // If other authenticated users try to access /auth, redirect to home
            if (state.url.startsWith('/auth')) {
                this.router.navigate(['/']);
                return false;
            }
        }

        // Otherwise (Visitor or Client), allow access
        return true;
    }
}
