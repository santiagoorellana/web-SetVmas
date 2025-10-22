import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmAccountPage } from './confirm-account.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmAccountPageRoutingModule {}
