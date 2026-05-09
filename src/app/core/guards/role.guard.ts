import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        const expectedRoles: string[] = route.data['roles'];

        // If no user is authenticated (VISITOR), redirect to signin
        if (!currentUser) {
            this.router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        // Defensive check: If no expected roles defined for this route, allow access
        if (!expectedRoles || expectedRoles.length === 0) {
            return true;
        }

        // Case-insensitive role check
        const userRole = (currentUser.role || '').toUpperCase();
        const hasRole = expectedRoles.some(role => role.toUpperCase() === userRole);

        if (hasRole) {
            return true;
        }

        // Authenticated but unauthorized
        console.warn(`User with role ${userRole} attempted to access ${state.url} but required roles are: ${expectedRoles.join(', ')}`);
        
        if (userRole === 'ADMIN') {
            this.router.navigate(['/admin']);
        } else {
            this.router.navigate(['/']);
        }
        return false;
    }
}
