import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../../components/configuration/home/home.component';
import { AdminComponent } from '../../components/configuration/admin/admin.component';
import { AdvertComponent } from '../../components/configuration/advert/advert.component';
import { UserComponent } from '../../components/configuration/user/user.component';
import { CategoryComponent } from '../../components/configuration/category/category.component';
import { TagComponent } from 'src/app/components/configuration/tag/tag.component';
import { AddTagComponent } from 'src/app/components/configuration/tag/add-tag/add-tag.component';
import { TransferComponent } from 'src/app/components/configuration/transfer/transfer.component';
import { DenounceComponent } from 'src/app/components/configuration/denounce/denounce.component';
import { EditDenunciaComponent } from 'src/app/components/configuration/denounce/edit-denuncia/edit-denuncia.component';
import { PaymentComponent } from 'src/app/components/configuration/payment/payment.component';
import { StaticPagesComponent } from 'src/app/components/configuration/static-pages/static-pages.component';
import { EditPaginasEstaticasComponent } from 'src/app/components/configuration/static-pages/edit-paginas-estaticas/edit-paginas-estaticas.component';
import { ConfigurationVariablesComponent } from 'src/app/components/configuration/configuration-variables/configuration-variables.component';
import { ReportComponent } from 'src/app/components/configuration/report/report.component';
import { TypeTransfersComponent } from 'src/app/components/configuration/nom/type-transfers/type-transfers.component';
import { UserClassesComponent } from 'src/app/components/configuration/nom/user-classes/user-classes.component';
import { EditClasesUsuariosComponent } from 'src/app/components/configuration/nom/user-classes/edit-clases-usuarios/edit-clases-usuarios.component';
import { AddCategoryComponent } from 'src/app/components/configuration/category/add-category/add-category.component';
import { AddVariableConfiguracionComponent } from 'src/app/components/configuration/configuration-variables/add-variable-configuracion/add-variable-configuracion.component';
import { TipoTransferenciaAddComponent } from 'src/app/components/configuration/nom/type-transfers/tipo-transferencia-add/tipo-transferencia-add.component';
import { TipoOpcionComponent } from 'src/app/components/configuration/nom/type-options/tipo-opcion.component';
import { EditTipoOpcionComponent } from 'src/app/components/configuration/nom/type-options/edit-tipo-opcion/edit-tipo-opcion.component';
import { MotivoDenunciaComponent } from 'src/app/components/configuration/nom/motive-denounce/motivo-denuncia.component';
import { AddMotivoDenunciaComponent } from 'src/app/components/configuration/nom/motive-denounce/add-motivo-denuncia/add-motivo-denuncia.component';
import { FactoresbonificacionventasComponent } from 'src/app/components/configuration/nom/bonus-factors/factoresbonificacionventas.component';
import {AddTransferenciaComponent} from '../../components/configuration/transfer/add-transferencia/add-transferencia.component';
import { AddUsuarioComponent } from 'src/app/components/configuration/user/add-usuario/add-usuario.component';
import {RegistryReferredComponent} from 'src/app/components/registry-referred/registry-referred.component';
import {ViewReportsComponent} from 'src/app/components/configuration/view-reports/view-reports.component';
import {ViewReportCluComponent} from 'src/app/components/configuration/view-report-clu/view-report-clu.component';
import {ViewReportPuntosComponent} from 'src/app/components/configuration/view-report-puntos/view-report-puntos.component';

import { AuthGuard } from 'src/app/_helpers/auth.guard';
import { RoutingReferredModule } from 'src/app/modules/utils/routing-referred';

const routes: Routes = [
  {
   
    
    path: '',
    component: HomeComponent,
 
    children: [
      {
        path: '',
        component: AdminComponent,canActivate: [AuthGuard]
      },
      {
        path: 'anuncios',
        component: AdvertComponent, canActivate: [AuthGuard]
      },
      {
        path: 'usuarios',
        component: UserComponent, canActivate: [AuthGuard]
      },
      {
        path: 'usuarios/add/:id',
        component: AddUsuarioComponent, canActivate: [AuthGuard]
      },
      {
        path: 'categorias',
        component: CategoryComponent, canActivate: [AuthGuard]
      },
      {
        path: 'categorias/add/:id',
        component: AddCategoryComponent, canActivate: [AuthGuard]
      },
      {
        path: 'etiquetas',
        component: TagComponent, canActivate: [AuthGuard]
      },
      {
        path: 'etiquetas/add/:id',
        component: AddTagComponent, canActivate: [AuthGuard]
      },
      {
        path: 'transferencias',
        component: TransferComponent, canActivate: [AuthGuard]
      },
      {
        path: 'transferencias/add/:id',
        component: AddTransferenciaComponent, canActivate: [AuthGuard]
      },
      {
        path: 'denuncias',
        component: DenounceComponent, canActivate: [AuthGuard]
      },
      {
        path: 'denuncias/edit/:id',
        component: EditDenunciaComponent, canActivate: [AuthGuard]
      },
      {
        path: 'pagos',
        component: PaymentComponent, canActivate: [AuthGuard]
      },
      {
        path: 'paginas',
        component: StaticPagesComponent, canActivate: [AuthGuard]
      },
   
      {
        path: 'paginas/add/:id',
        component: EditPaginasEstaticasComponent, canActivate: [AuthGuard]
      },
      {
        path: 'variables',
        component: ConfigurationVariablesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'variables/add/:id',
         component: AddVariableConfiguracionComponent, canActivate: [AuthGuard]
      },
      {
        path: 'nomencladores/clases-usuarios',
        component: UserClassesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'nomencladores/clases-usuarios/edit/:id',
        component: EditClasesUsuariosComponent, canActivate: [AuthGuard]
      },
      {
        path: 'nomencladores/tipo-transferencias',
        component: TypeTransfersComponent, canActivate: [AuthGuard]
      },
      {
        path: 'nomencladores/tipo-transferencias/add/:id',
        component: TipoTransferenciaAddComponent, canActivate: [AuthGuard]
      },
      {
        path: 'nomencladores/tipos-opciones',
        component: TipoOpcionComponent, canActivate: [AuthGuard]
      },
      {
        path: 'nomencladores/tipos-opciones/edit/:id',
        component: EditTipoOpcionComponent, canActivate: [AuthGuard]
      },
      {
        path: 'nomencladores/motivos-denuncia',
        component: MotivoDenunciaComponent, canActivate: [AuthGuard]
      },
      {
        path: 'nomencladores/motivos-denuncia/add/:id',
        component: AddMotivoDenunciaComponent, canActivate: [AuthGuard]
      },
      {
        path: 'nomencladores/factores-bonificacion',
        component: FactoresbonificacionventasComponent, canActivate: [AuthGuard]
      },
      {
        path: 'reportes',
        component: ReportComponent, canActivate: [AuthGuard]
      },
      { path: 'reporte/:id', component: ViewReportsComponent },
      { path: 'reporteclu', component: ViewReportCluComponent},
      { path: 'reportepuntos', component: ViewReportPuntosComponent }

    ]

    //
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
