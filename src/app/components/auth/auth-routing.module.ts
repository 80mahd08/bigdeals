import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { PassResetComponent } from './pass-reset/pass-reset.component';
import { PassCreateComponent } from './pass-create/pass-create.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LogoutComponent } from './logout/logout.component';
import { SuccessMsgComponent } from './success-msg/success-msg.component';
import { ErrorsComponent } from './errors/errors.component';
import { Page500Component } from './errors/page500.component';
import { OfflineComponent } from './errors/offline.component';

const routes: Routes = [
  {
    path: 'signin', component: SigninComponent
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: 'pass-reset', component: PassResetComponent
  },
  {
    path: 'pass-create', component: PassCreateComponent
  },
  {
    path: 'lockscreen', component: LockscreenComponent
  },
  {
    path: 'logout', component: LogoutComponent
  },
  {
    path: 'success-msg', component: SuccessMsgComponent
  },
  {
    path: 'errors', component: ErrorsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
