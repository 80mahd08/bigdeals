import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application/application.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdFormComponent } from './ad-form/ad-form.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ANNOUNCER'] }
  },
  {
    path: 'ads/new',
    component: AdFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ANNOUNCER'] }
  },
  {
    path: 'ads/:id',
    component: AdFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ANNOUNCER'] }
  },
  {
    path: 'apply',
    component: ApplicationComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncerRoutingModule { }
