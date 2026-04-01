import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';

// Components
import { FooterComponent } from './footer/footer.component';
import { TopbarUserComponent } from './topbaruser/topbaruser.component';

@NgModule({
  declarations: [
    FooterComponent,
    TopbarUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    FormsModule,
    AuthModule
  ],
  exports: [
    FooterComponent,
    TopbarUserComponent,
    AuthModule
  ]
})
export class LayoutsModule { }
