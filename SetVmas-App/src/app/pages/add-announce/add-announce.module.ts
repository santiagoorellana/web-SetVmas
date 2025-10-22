import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddAnnouncePage } from './add-announce.page';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/Camera/ngx';
import { NetworkService } from '../../services/network.service';
import { IonicSelectableModule } from 'ionic-selectable';
import { RecaptchaModule } from 'ng-recaptcha';
const routes: Routes = [
  {
    path: '',
    component: AddAnnouncePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    IonicSelectableModule,
    RecaptchaModule
  ],
  declarations: [AddAnnouncePage],
  providers: [
    NetworkService,
    Camera
  ]
})
export class AddAnnouncePageModule { }
