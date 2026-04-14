import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent as TransactionsComponent } from './transactions/orders.component';
import { CustomersComponent as UsersComponent } from './users/customers.component';
import { SellersComponent as AnnouncersComponent } from './announcers/sellers.component';
import { ProductsComponent as AdsComponent } from './ads/products.component';
import { CategoriesComponent } from './categories/categories.component';

@NgModule({
  declarations: [
    DashboardComponent,
    TransactionsComponent,
    UsersComponent,
    AnnouncersComponent,
    AdsComponent,
    CategoriesComponent
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
    TranslateModule.forChild({ extend: true })
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AdminModule { }
