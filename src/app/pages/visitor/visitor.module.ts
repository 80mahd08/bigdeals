import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbPaginationModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VisitorRoutingModule } from './visitor-routing.module';
import { LandingComponent } from './landing/landing.component';
import { AdsListingComponent } from './ads-listing/ads-listing.component';
import { AdDetailComponent } from './ad-detail/ad-detail.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { AdCardComponent } from './components/ad-card/ad-card.component';
import { AboutComponent } from './about/about.component';
import { TermsComponent } from './terms/terms.component';
import { LayoutsModule } from '../../components/layouts.module';

@NgModule({
  declarations: [
    LandingComponent,
    AdsListingComponent,
    AdDetailComponent,
    SellerProfileComponent,
    AdCardComponent,
    AboutComponent,
    TermsComponent
  ],
  exports: [
    AdCardComponent
  ],
  imports: [
    CommonModule,
    VisitorRoutingModule,
    RouterModule,
    LayoutsModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbDropdownModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisitorModule { }
