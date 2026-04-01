import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';

/**
 * LogoutComponent
 *
 * This component is navigated to when the user performs a logout action
 * via a direct URL visit (e.g. /auth/logout). It immediately calls the
 * AuthenticationService logout method which:
 *   1. Signs the user out of Firebase
 *   2. Clears sessionStorage (currentUser, token)
 *   3. Dispatches the NgRx logout action
 *   4. Redirects to /auth/signin
 *
 * The template shows a brief "Déconnexion en cours..." message before the redirect.
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  standalone: false
})
export class LogoutComponent implements OnInit {

  // Current year for the footer
  year: number = new Date().getFullYear();

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  /**
   * As soon as this component is initialized, trigger the logout flow.
   * This way any link to /auth/logout immediately clears the session.
   */
  ngOnInit(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Navigation is handled inside auth.service.ts logout() tap()
        // but we add a fallback here in case it doesn't fire
        this.router.navigate(['/auth/signin']);
      },
      error: () => {
        // Even if Firebase logout fails, clear locally and redirect
        sessionStorage.clear();
        this.router.navigate(['/auth/signin']);
      }
    });
  }
}
