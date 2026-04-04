import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbPaginationModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { VisitorRoutingModule } from './visitor-routing.module';
import { LandingComponent } from './landing/landing.component';
import { AdsListingComponent } from './ads-listing/ads-listing.component';
import { AdDetailComponent } from './ad-detail/ad-detail.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { LayoutsModule } from '../../components/layouts.module';

@NgModule({
  declarations: [
    LandingComponent,
    AdsListingComponent,
    AdDetailComponent,
    SellerProfileComponent
  ],
  imports: [
    CommonModule,
    VisitorRoutingModule,
    LayoutsModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbDropdownModule
  ]
})
export class VisitorModule { }
