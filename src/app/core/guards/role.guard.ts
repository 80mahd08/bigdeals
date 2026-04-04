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

        if (currentUser && currentUser.role && expectedRoles.includes(currentUser.role)) {
            // role authorized so return true
            return true;
        }

        // role not authorized so redirect to home or login
        if (currentUser) {
            this.router.navigate(['/']);
        } else {
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        }
        return false;
    }
}
