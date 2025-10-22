import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmAccountPageRoutingModule } from './confirm-account-routing.module';

import { ConfirmAccountPage } from './confirm-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmAccountPageRoutingModule
  ],
  declarations: [ConfirmAccountPage]
})
export class ConfirmAccountPageModule {}
