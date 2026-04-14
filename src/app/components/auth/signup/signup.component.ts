import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// NgRx actions and state type
import { Register } from 'src/app/store/Authentication/authentication.actions';
import { AuthenticationState } from 'src/app/store/Authentication/authentication.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: false
})
export class SignupComponent implements OnInit, OnDestroy {

  // Reactive form group for email, username, and password registration fields
  signupForm!: UntypedFormGroup;

  // True after the user first clicks submit — enables validation UI
  submitted = false;

  // Controls password visibility toggle (true = visible text, false = hidden)
  fieldTextType = false;

  // Holds an error message if Firebase registration fails
  error = '';

  // True while Firebase is processing the registration request
  loading = false;

  // Current year shown in the footer template
  year: number = new Date().getFullYear();

  // Used to auto-unsubscribe from store to prevent memory leaks
  private destroy$ = new Subject<void>();

  /**
   * @param formBuilder - Angular service to build the reactive form
   * @param store       - NgRx global store for dispatching Register action
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store<{ authentication: AuthenticationState }>
  ) { }

  /**
   * Sets up the signup form with validation rules and attaches the password
   * strength checker to the password input field events.
   */
  ngOnInit(): void {
    // Build the form with required validators
    this.signupForm = this.formBuilder.group({
      email:    ['', [Validators.required, Validators.email]],
      name:     ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Subscribe to the NgRx auth store to track loading and error states
    this.store.select('authentication').pipe(
      takeUntil(this.destroy$)
    ).subscribe((state) => {
      this.loading = state.loading;
      if (state.error) {
        this.error = state.error;
      }
    });

    // --- Password Strength UI Logic ---
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    const passLower  = document.getElementById('pass-lower');
    const passUpper  = document.getElementById('pass-upper');
    const passNumber = document.getElementById('pass-number');
    const passLength = document.getElementById('pass-length');

    if (passwordInput) {
      // Show requirements panel when user focuses the password field
      passwordInput.onfocus = () => {
        const container = document.getElementById('password-contain');
        if (container) container.style.display = 'block';
      };

      // Hide requirements panel when user leaves the password field
      passwordInput.onblur = () => {
        const container = document.getElementById('password-contain');
        if (container) container.style.display = 'none';
      };

      // Live-update requirement indicators as the user types
      passwordInput.onkeyup = () => {
        const val = passwordInput.value;

        // Check lowercase letters
        this.toggleValidation(passLower, /[a-z]/.test(val));
        // Check uppercase letters
        this.toggleValidation(passUpper, /[A-Z]/.test(val));
        // Check numbers
        this.toggleValidation(passNumber, /[0-9]/.test(val));
        // Check minimum length of 8 characters
        this.toggleValidation(passLength, val.length >= 8);
      };
    }
  }

  /**
   * Convenience getter for accessing form controls from the template.
   * Example: f['email'].errors
   */
  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = ''; // Clear any previous errors

    // Stop if the form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    // Dispatch the Register action — the Effect handles API communication
    this.store.dispatch(Register({
      email:      this.f['email'].value,
      first_name: this.f['name'].value,
      password:   this.f['password'].value
    }));
  }

  /**
   * Toggles the password input type between visible text and hidden password dots.
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  /**
   * Helper to toggle 'valid' / 'invalid' classes on password strength indicator elements.
   *
   * @param element - The DOM element for a requirement indicator
   * @param isValid - Whether the requirement is currently met
   */
  private toggleValidation(element: HTMLElement | null, isValid: boolean) {
    if (!element) return;
    element.classList.toggle('valid', isValid);
    element.classList.toggle('invalid', !isValid);
  }

  /**
   * Cleans up the store subscription when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
