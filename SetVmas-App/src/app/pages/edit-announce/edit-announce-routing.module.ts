import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAnnouncePage } from './edit-announce.page';

const routes: Routes = [
  {
    path: '',
    component: EditAnnouncePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAnnouncePageRoutingModule {}
