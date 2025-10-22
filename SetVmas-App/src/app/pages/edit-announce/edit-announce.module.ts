import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAnnouncePageRoutingModule } from './edit-announce-routing.module';

import { EditAnnouncePage } from './edit-announce.page';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicSelectableModule } from 'ionic-selectable';
import { NetworkService } from '../../services/network.service';
import { Camera } from '@ionic-native/Camera/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAnnouncePageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicSelectableModule
  ],
  declarations: [EditAnnouncePage],
  providers: [
    NetworkService,
    Camera
  ]
})
export class EditAnnouncePageModule {}
