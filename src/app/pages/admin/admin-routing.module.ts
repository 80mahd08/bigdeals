import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent as UsersComponent } from './users/customers.component';
import { SellersComponent as AnnouncersComponent } from './announcers/sellers.component';
import { ProductsComponent as AdsComponent } from './ads/products.component';
import { PaymentsComponent } from './payments/payments.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'announcers',
    component: AnnouncersComponent
  },
  {
    path: 'ads',
    component: AdsComponent
  },
  {
    path: 'annonceur-payments',
    component: PaymentsComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'orders',
    component: AdminOrdersComponent
  },
  {
    path: 'settings',
    redirectTo: 'dashboard'
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
export class AdminRoutingModule { }
