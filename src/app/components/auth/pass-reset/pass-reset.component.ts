import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-pass-reset',
    templateUrl: './pass-reset.component.html',
    styleUrls: ['./pass-reset.component.scss'],
    standalone: false
})

/**
 * PassReset Component
 */
export class PassResetComponent implements OnInit {

  // Form
  passresetForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  year: number = new Date().getFullYear();
  success = '';
  loading = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    /**
     * Form Validation
     */
     this.passresetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.passresetForm.controls; }

  /**
   * Form submit
   */
   onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.passresetForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.resetPassword(this.f['email'].value).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = "Si un compte est associé à cette adresse, vous recevrez un email pour réinitialiser votre mot de passe.";
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }

}
