import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../../components/home/home/home.component';
import { InitialComponent } from '../../components/home/initial/initial.component';
import { OfficeComponent } from '../../components/home/office/office.component';
import { AppHomeComponent } from '../../components/home/app-home/app-home.component';
import { HelpComponent } from '../../components/home/help/help.component';
import {ViewStaticPagesComponent} from '../../components/home/static-pages/view-static-pages/view-static-pages.component';
import { AdDetailsComponent } from 'src/app/components/home/ad-details/ad-details.component';
import { EmailConfirmComponent } from 'src/app/components/common/modals/home/email-confirm/email-confirm.component';
import {RegistryReferredComponent} from 'src/app/components/registry-referred/registry-referred.component';

import { AuthGuard } from 'src/app/_helpers/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  
  {  path: 'r/:id', component: RegistryReferredComponent },
 
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'inicio',
        component: InitialComponent
      },
      {
        path: 'oficina',
        component: OfficeComponent, canActivate: [AuthGuard]
      },
      {
        path: 'app',
        component: AppHomeComponent
      },
      {
        path: 'ayuda',
        component: HelpComponent
      },
      {
        path: 'pagina/:id',
        component: ViewStaticPagesComponent
      },
      {
        path: 'detalles-anuncio/:id',
        component: AdDetailsComponent
      },
      {
        path: 'email-confirm',
        component: EmailConfirmComponent
      },
 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
