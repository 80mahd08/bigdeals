import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { BecomeAnnouncerComponent } from './become-announcer/become-announcer.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { LayoutsModule } from '../../components/layouts.module';
import { VisitorModule } from '../visitor/visitor.module';

@NgModule({
  declarations: [
    ProfileComponent,
    FavoritesComponent,
    BecomeAnnouncerComponent,
    CartComponent,
    CheckoutComponent,
    ProductCheckoutComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    LayoutsModule,
    VisitorModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ClientModule { }
