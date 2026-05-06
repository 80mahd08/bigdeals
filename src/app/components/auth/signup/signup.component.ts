import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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

  signupForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType = false;
  error = '';
  loading = false;
  year: number = new Date().getFullYear();
  showPasswordRequirements = false;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store<{ authentication: AuthenticationState }>
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      prenom:   ['', [Validators.required]],
      nom:      ['', [Validators.required]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        (control: AbstractControl) => {
          const value = control.value || '';
          if (!/[a-z]/.test(value)) return { missingLower: true };
          if (!/[A-Z]/.test(value)) return { missingUpper: true };
          if (!/[0-9]/.test(value)) return { missingNumber: true };
          return null;
        }
      ]],
    });

    this.store.select('authentication').pipe(
      takeUntil(this.destroy$)
    ).subscribe((state) => {
      this.loading = state.loading;
      if (state.error) {
        this.error = state.error;
      }
    });

    // Strength UI setup
    setTimeout(() => {
        const passwordInput = document.getElementById('password-input') as HTMLInputElement;
        const passLower  = document.getElementById('pass-lower');
        const passUpper  = document.getElementById('pass-upper');
        const passNumber = document.getElementById('pass-number');
        const passLength = document.getElementById('pass-length');

        if (passwordInput) {
        passwordInput.onfocus = () => {
            const container = document.getElementById('password-contain');
            if (container) container.style.display = 'block';
        };

        passwordInput.onblur = () => {
            const container = document.getElementById('password-contain');
            if (container) container.style.display = 'none';
        };

        passwordInput.onkeyup = () => {
            const val = passwordInput.value;
            this.toggleValidation(passLower, /[a-z]/.test(val));
            this.toggleValidation(passUpper, /[A-Z]/.test(val));
            this.toggleValidation(passNumber, /[0-9]/.test(val));
            this.toggleValidation(passLength, val.length >= 8);
        };
        }
    }, 500);
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.signupForm.invalid) {
      return;
    }

    this.store.dispatch(Register({
      prenom:   this.f['prenom'].value,
      nom:      this.f['nom'].value,
      email:    this.f['email'].value,
      password: this.f['password'].value
    }));
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  private toggleValidation(element: HTMLElement | null, isValid: boolean) {
    if (!element) return;
    element.classList.toggle('valid', isValid);
    element.classList.toggle('invalid', !isValid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
