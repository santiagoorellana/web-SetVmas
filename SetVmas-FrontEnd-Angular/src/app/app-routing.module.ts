import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeRoutingModule } from './modules/home/home-routing.module';
import { AdDetailsComponent } from 'src/app/components/home/ad-details/ad-details.component';
import { EmailConfirmComponent } from 'src/app/components/common/modals/home/email-confirm/email-confirm.component';
import { ErrorPageComponent } from 'src/app/components/home/error-page/error-page.component';
import {ReportViewerModule} from 'ngx-ssrs-reportviewer';
import { RegistryReferredComponent } from 'src/app/components/registry-referred/registry-referred.component';

const routes: Routes = [

  {path: 'r/:id', component: RegistryReferredComponent},
  { path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: 'admin', loadChildren: () => import('./modules/configuration/configuration.module').then(m => m.ConfigurationModule) },
//  { path: '**', redirectTo: '/inicio' }


  {path: 'not-found', component: ErrorPageComponent, data: {message: 'Page not found'} },
 
  {path: '**', redirectTo: '/not-found' },




];

@NgModule({
  imports: [
    HomeRoutingModule,
    
    RouterModule.forRoot(routes),
    ReportViewerModule
  ],
  exports: [RouterModule,ReportViewerModule]
})
export class AppRoutingModule { }
