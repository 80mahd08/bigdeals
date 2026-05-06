import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent as TransactionsComponent } from './transactions/orders.component';
import { CustomersComponent as UsersComponent } from './users/customers.component';
import { SellersComponent as AnnouncersComponent } from './announcers/sellers.component';
import { ProductsComponent as AdsComponent } from './ads/products.component';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'transactions',
    component: TransactionsComponent
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
    path: 'categories',
    component: CategoriesComponent
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
