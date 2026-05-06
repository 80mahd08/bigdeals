import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';

// Components
import { FooterComponent } from './footer/footer.component';
import { TopbarUserComponent } from './topbaruser/topbaruser.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';

@NgModule({
  declarations: [
    FooterComponent,
    TopbarUserComponent,
    AdminSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbCollapseModule,
    SimplebarAngularModule,
    FormsModule,
    AuthModule
  ],
  exports: [
    FooterComponent,
    TopbarUserComponent,
    AdminSidebarComponent,
    AuthModule
  ]
})
export class LayoutsModule { }
