import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AnnouncerRoutingModule } from './announcer-routing.module';
import { ApplicationComponent } from './application/application.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdFormComponent } from './ad-form/ad-form.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    DashboardComponent,
    AdFormComponent
  ],
  imports: [
    CommonModule,
    AnnouncerRoutingModule,
    NgbDropdownModule,
    FormsModule,
    TranslateModule.forChild({ extend: true })
  ]
})
export class AnnouncerModule { }
