import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

/**
 * LandingRedirectGuard
 * 
 * This guard is used on the root/landing route. 
 * If an ADMIN or ANNOUNCER is logged in, they should be redirected 
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
            // If user is ADMIN, redirect to admin dashboard
            if (currentUser.role === 'ADMIN') {
                this.router.navigate(['/admin']);
                return false;
            }
            
            // If user is ANNOUNCER, redirect to announcer dashboard
            if (currentUser.role === 'ANNOUNCER') {
                this.router.navigate(['/announcer/dashboard']);
                return false;
            }
        }

        // Otherwise (Visitor or Client), allow landing page access
        return true;
    }
}
