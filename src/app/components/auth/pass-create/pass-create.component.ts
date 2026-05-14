import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-pass-create',
    templateUrl: './pass-create.component.html',
    styleUrls: ['./pass-create.component.scss'],
    standalone: false
})

/**
 * PassCreate Component
 */
export class PassCreateComponent implements OnInit {

   // Login passresetForm
   passresetForm!: UntypedFormGroup;
   submitted = false;
   passwordField!: boolean;
   confirmField!: boolean;
   error = '';
   returnUrl!: string;
   // set the current year
   year: number = new Date().getFullYear();
   success = '';
   loading = false;
   showPasswordRequirements = false;
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
        cpassword: ['', [Validators.required]]
     });

     this.token = this.route.snapshot.queryParamMap.get('token');
     if (!this.token) {
       this.error = "Jeton de réinitialisation manquant dans l'URL.";
     }

      // Password Strength UI setup
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

    private toggleValidation(element: HTMLElement | null, isValid: boolean) {
      if (!element) return;
      element.classList.toggle('valid', isValid);
      element.classList.toggle('invalid', !isValid);
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
           this.success = "Mot de passe réinitialisé avec succès. Redirection vers la page de connexion...";
           setTimeout(() => {
             this.router.navigate(['/auth/signin']);
           }, 3000);
         } else {
           this.error = res.message || 'Une erreur est survenue.';
         }
       },
       error: (err) => {
         this.loading = false;
         console.error('Password reset error:', err);
         this.error = err.error?.message || err.error || err.message || 'Une erreur est survenue lors de la réinitialisation.';
       }
     });
   }

   /**
   * Password Hide/Show
   */
    togglepasswordField() {
      this.passwordField = !this.passwordField;
    }

    /**
   * Password Hide/Show
   */
    toggleconfirmField() {
      this.confirmField = !this.confirmField;
    }

}
