import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AnnouncerRoutingModule } from './announcer-routing.module';
import { ApplicationComponent } from './application/application.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdFormComponent } from './ad-form/ad-form.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { OrdersComponent } from './orders/orders.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { LayoutsModule } from '../../components/layouts.module';

@NgModule({
  declarations: [
    ApplicationComponent,
    DashboardComponent,
    AdFormComponent,
    AnnouncementsComponent,
    OrdersComponent,
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    AnnouncerRoutingModule,
    NgbDropdownModule,
    FormsModule,
    LayoutsModule
  ]
})
export class AnnouncerModule { }
