import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactPage } from './contact.page';
import { NetworkService } from '../../services/network.service';
import { RecaptchaModule } from 'ng-recaptcha';

const routes: Routes = [
  {
    path: '',
    component: ContactPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    RecaptchaModule
  ],
  declarations: [ContactPage],
  providers: [NetworkService]
})
export class ContactPageModule {}
