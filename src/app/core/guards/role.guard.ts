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

        // If user is authenticated, check roles
        if (currentUser.role && expectedRoles.includes(currentUser.role)) {
            return true;
        }

        // Authenticated but unauthorized
        if (currentUser.role === 'ADMIN') {
            this.router.navigate(['/admin']);
        } else {
            this.router.navigate(['/']);
        }
        return false;
    }
}
