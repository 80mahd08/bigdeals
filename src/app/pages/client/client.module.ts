import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ChatComponent } from './chat/chat.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { DetailsComponent as InvoiceDetailsComponent } from './invoices/details/details.component';

// Ng2SearchPipeModule or other common template modules might be needed, add them if the build complains.

@NgModule({
  declarations: [
    ProfileComponent,
    FavoritesComponent,
    ChatComponent,
    CartComponent,
    CheckoutComponent,
    OrdersComponent,
    InvoiceDetailsComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
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
