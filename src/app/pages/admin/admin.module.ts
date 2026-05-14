import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent as UsersComponent } from './users/customers.component';
import { SellersComponent as AnnouncersComponent } from './announcers/sellers.component';
import { ProductsComponent as AdsComponent } from './ads/products.component';
import { PaymentsComponent } from './payments/payments.component';
import { ReportsComponent } from './reports/reports.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';

import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    AnnouncersComponent,
    AdsComponent,
    PaymentsComponent,
    ReportsComponent,
    AdminOrdersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbNavModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AdminModule { }
