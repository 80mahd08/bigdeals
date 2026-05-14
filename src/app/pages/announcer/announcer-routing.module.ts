import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application/application.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdFormComponent } from './ad-form/ad-form.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { AnnouncerOrdersComponent } from './orders/announcer-orders.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ANNONCEUR'] }
  },
  {
    path: 'announcements',
    component: AnnouncementsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ANNONCEUR'] }
  },
  {
    path: 'announcements/create',
    component: AdFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ANNONCEUR'] }
  },
  {
    path: 'announcements/:id/edit',
    component: AdFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ANNONCEUR'] }
  },

  {
    path: 'reviews',
    component: ReviewsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ANNONCEUR'] }
  },
  {
    path: 'orders',
    component: AnnouncerOrdersComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ANNONCEUR'] }
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
