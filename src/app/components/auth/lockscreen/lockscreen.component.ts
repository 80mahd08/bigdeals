import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/store/Authentication/auth.models';

@Component({
    selector: 'app-lockscreen',
    templateUrl: './lockscreen.component.html',
    styleUrls: ['./lockscreen.component.scss'],
    standalone: false
})
export class LockscreenComponent implements OnInit {

  lockscreenForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  year: number = new Date().getFullYear();
  currentUser: User | null = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.lockscreenForm = this.formBuilder.group({
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.lockscreenForm.controls; }

  get avatarLetter(): string {
    const name = this.currentUser?.prenom ?? this.currentUser?.email ?? 'U';
    return name.charAt(0).toUpperCase();
  }

   onSubmit() {
    this.submitted = true;
    if (this.lockscreenForm.invalid) {
      return;
    }
    this.router.navigate(['/']);
  }
}
