import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AdsListingComponent } from './ads-listing/ads-listing.component';
import { AdDetailComponent } from './ad-detail/ad-detail.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { AboutComponent } from './about/about.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'ads',
    component: AdsListingComponent
  },
  {
    path: 'ads/:id',
    component: AdDetailComponent
  },
  {
    path: 'seller/:id',
    component: SellerProfileComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorRoutingModule { }
