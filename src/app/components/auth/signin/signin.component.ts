import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// NgRx actions and state selectors
import { login } from 'src/app/store/Authentication/authentication.actions';
import { AuthenticationState } from 'src/app/store/Authentication/authentication.reducer';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: false
})
export class SigninComponent implements OnInit, OnDestroy {

  // The reactive form group for the email/password login fields
  loginForm!: UntypedFormGroup;

  // True after the user hits submit — enables validation message display in the template
  submitted = false;

  // Controls whether the password field is visible (text) or hidden (password)
  fieldTextType = false;

  // Holds an error message string to display if authentication fails
  error = '';

  // True while the Firebase auth request is in progress (shows a loading spinner)
  loading = false;

  // Current year shown in the footer
  year: number = new Date().getFullYear();

  // Used to clean up subscriptions when the component is destroyed
  private destroy$ = new Subject<void>();

  /**
   * @param formBuilder - Angular service for creating reactive forms
   * @param store       - NgRx global store for dispatching actions
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store<{ authentication: AuthenticationState }>
  ) { }

  /**
   * Initializes the login form with basic required-field validation.
   * Also subscribes to the NgRx store to listen for errors and loading state.
   */
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Subscribe to the auth state in the store to react to errors and loading
    this.store.select('authentication').pipe(
      takeUntil(this.destroy$)
    ).subscribe((state) => {
      this.loading = state.loading;
      // If login fails, the store will have an error — display it in the template
      if (state.error) {
        this.error = state.error;
      }
    });
  }

  /**
   * Convenience getter for easy access to form controls from the template.
   * Usage in template: f['email'].errors
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Triggered when the user submits the sign-in form.
   * Validates the form and dispatches the `login` NgRx action with the credentials.
   * The actual Firebase call happens inside the authentication effect.
   */
  onSubmit() {
    this.submitted = true;
    this.error = ''; // Clear previous errors on new attempt

    // Stop here if the form is invalid (e.g. empty fields or bad email format)
    if (this.loginForm.invalid) {
      return;
    }

    // Dispatch the `login` action — effects will handle the API call
    this.store.dispatch(login({
      email: this.f['email'].value,
      password: this.f['password'].value
    }));
  }

  /**
   * Toggles the password input type between 'text' (visible) and 'password' (hidden).
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  /**
   * Clean up subscriptions when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
