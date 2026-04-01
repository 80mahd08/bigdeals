import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

// Load Icons
import { defineElement } from "@lordicon/element";
import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import lottie from 'lottie-web';
import { SignupComponent } from './signup/signup.component';
import { PassResetComponent } from './pass-reset/pass-reset.component';
import { PassCreateComponent } from './pass-create/pass-create.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LogoutComponent } from './logout/logout.component';
import { SuccessMsgComponent } from './success-msg/success-msg.component';
import { ErrorsComponent } from './errors/errors.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    PassResetComponent,
    PassCreateComponent,
    LockscreenComponent,
    LogoutComponent,
    SuccessMsgComponent,
    ErrorsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    NgbCarouselModule,
    NgOtpInputModule,
    AuthRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
