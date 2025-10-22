import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VirtualOfficePage } from './virtual-office.page';
import { NetworkService } from '../../services/network.service';

const routes: Routes = [
  {
    path: '',
    component: VirtualOfficePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VirtualOfficePage],
  providers: [NetworkService],
})
export class VirtualOfficePageModule {}
