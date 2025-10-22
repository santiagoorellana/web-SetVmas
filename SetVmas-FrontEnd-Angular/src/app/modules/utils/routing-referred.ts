import { Routes, RouterModule } from '@angular/router';
import { RegistryReferredComponent } from '../../components/registry-referred/registry-referred.component';
import { NgModule } from '@angular/core';




const routes: Routes = [
  //  { path: 'r/:id', component: RegistryReferredComponent},
  ];


  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class RoutingReferredModule { }
