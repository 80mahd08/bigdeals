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

  // Login Form
  passresetForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  success = '';
  loading = false;
  token: string | null = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
     this.passresetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      cpassword: ['', [Validators.required]]
    });

    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = "Jeton de réinitialisation manquant dans l'URL.";
    }
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

    if (this.f['password'].value !== this.f['cpassword'].value) {
      this.error = "Les mots de passe ne correspondent pas.";
      return;
    }

    if (!this.token) {
      this.error = "Jeton invalide.";
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.resetPasswordConfirm(this.token, this.f['password'].value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.success = res.message || 'Mot de passe réinitialisé avec succès.';
        } else {
          this.error = res.message || 'Une erreur est survenue.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de la demande. Veuillez réessayer.';
      }
    });
  }

}
