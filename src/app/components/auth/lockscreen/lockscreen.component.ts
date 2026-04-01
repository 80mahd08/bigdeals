import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/store/Authentication/auth.models';

/**
 * LockscreenComponent
 *
 * This component is used to "lock" the app session visually.
 * It displays the current user's profile picture and name.
 * Entering a password (any password for now as it's a demo)
 * will navigate the user back to the home page.
 */
@Component({
    selector: 'app-lockscreen',
    templateUrl: './lockscreen.component.html',
    styleUrls: ['./lockscreen.component.scss'],
    standalone: false
})
export class LockscreenComponent implements OnInit {

  // Reactive form group for the lockscreen password field
  lockscreenForm!: UntypedFormGroup;

  // True after the user hits the unlock button
  submitted = false;

  // Holds an error message if unlock fails (not used in this simplified demo)
  error = '';

  // Current year for the footer
  year: number = new Date().getFullYear();

  // The currently authenticated user to display on the lock screen
  currentUser: User | null = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  /**
   * Initializes the form and fetches current user info.
   */
  ngOnInit(): void {
    // Get currently logged in user info (Name, Photo, etc.)
    this.currentUser = this.authService.currentUserValue;

    // Create the password form
    this.lockscreenForm = this.formBuilder.group({
      password: ['', [Validators.required]]
    });
  }

  /**
   * Convenience getter for form controls
   */
  get f() { return this.lockscreenForm.controls; }

  /**
   * Generates the first letter of the user's name for the initial avatar.
   */
  get avatarLetter(): string {
    const name = this.currentUser?.username ?? this.currentUser?.email ?? 'U';
    return name.charAt(0).toUpperCase();
  }

  /**
   * Triggered when the user clicks 'Unlock'.
   * Validates the form and navigates the user back to the home page.
   */
   onSubmit() {
    this.submitted = true;

    // Stop here if the form is invalid
    if (this.lockscreenForm.invalid) {
      return;
    }

    // In this demo, any password "unlocks" and redirects back home.
    // The user session isn't actually destroyed during lock screen, just visually locked.
    this.router.navigate(['/']);
  }
}
