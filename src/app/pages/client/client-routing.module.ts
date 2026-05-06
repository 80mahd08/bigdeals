import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { DetailsComponent as InvoiceDetailsComponent } from './invoices/details/details.component';
import { BecomeAnnouncerComponent } from './become-announcer/become-announcer.component';

import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT', 'ANNONCEUR'] }
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT', 'ANNONCEUR'] }
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT', 'ANNONCEUR'] }
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT', 'ANNONCEUR'] }
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT', 'ANNONCEUR'] }
  },
  {
    path: 'orders/:id',
    component: InvoiceDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT', 'ANNONCEUR'] }
  },
  {
    path: 'become-announcer',
    component: BecomeAnnouncerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT', 'ANNONCEUR'] }
  },
  {
    path: 'invoices/:id',
    component: InvoiceDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT', 'ANNONCEUR'] }
  },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
