import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';/*NO_ERRORS_SCHEMA,*/
import { CommonModule } from '@angular/common';

// MODULES
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { AngularMaterialModule } from '../utils/angular-material.module';
import { UtilsModule } from '../utils/utils.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { CKEditorModule } from 'ng2-ckeditor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// COMPONENTS
import { HomeComponent } from '../../components/configuration/home/home.component';
import { AdminComponent } from '../../components/configuration/admin/admin.component';
import { AdvertComponent } from '../../components/configuration/advert/advert.component';
import { UserComponent } from '../../components/configuration/user/user.component';
import { CategoryComponent } from '../../components/configuration/category/category.component';
import { AddCategoryComponent } from 'src/app/components/configuration/category/add-category/add-category.component';
import { TagComponent } from 'src/app/components/configuration/tag/tag.component';
import { AddTagComponent } from 'src/app/components/configuration/tag/add-tag/add-tag.component';
import { TransferComponent } from 'src/app/components/configuration/transfer/transfer.component';
import { AddTransferenciaComponent } from 'src/app/components/configuration/transfer/add-transferencia/add-transferencia.component';
import { DenounceComponent } from 'src/app/components/configuration/denounce/denounce.component';
import { PaymentComponent } from 'src/app/components/configuration/payment/payment.component';
import { StaticPagesComponent } from 'src/app/components/configuration/static-pages/static-pages.component';
import { EditPaginasEstaticasComponent } from 'src/app/components/configuration/static-pages/edit-paginas-estaticas/edit-paginas-estaticas.component';
import { ConfigurationVariablesComponent } from 'src/app/components/configuration/configuration-variables/configuration-variables.component';
import { UserClassesComponent } from 'src/app/components/configuration/nom/user-classes/user-classes.component';
import { EditClasesUsuariosComponent } from 'src/app/components/configuration/nom/user-classes/edit-clases-usuarios/edit-clases-usuarios.component';
import { TypeTransfersComponent } from 'src/app/components/configuration/nom/type-transfers/type-transfers.component';
import { ReportComponent } from 'src/app/components/configuration/report/report.component';
import { EditDenunciaComponent } from 'src/app/components/configuration/denounce/edit-denuncia/edit-denuncia.component';
import { AddVariableConfiguracionComponent } from 'src/app/components/configuration/configuration-variables/add-variable-configuracion/add-variable-configuracion.component';
import { TipoTransferenciaAddComponent } from 'src/app/components/configuration/nom/type-transfers/tipo-transferencia-add/tipo-transferencia-add.component';
import { TipoOpcionComponent } from 'src/app/components/configuration/nom/type-options/tipo-opcion.component';
import { EditTipoOpcionComponent } from 'src/app/components/configuration/nom/type-options/edit-tipo-opcion/edit-tipo-opcion.component';
import { MotivoDenunciaComponent } from 'src/app/components/configuration/nom/motive-denounce/motivo-denuncia.component';
import { AddMotivoDenunciaComponent } from 'src/app/components/configuration/nom/motive-denounce/add-motivo-denuncia/add-motivo-denuncia.component';
import { FactoresbonificacionventasComponent } from 'src/app/components/configuration/nom/bonus-factors/factoresbonificacionventas.component';
import { AddUsuarioComponent } from 'src/app/components/configuration/user/add-usuario/add-usuario.component';

import {ViewReportsComponent} from '../../components/configuration/view-reports/view-reports.component';
import {ViewReportCluComponent} from '../../components/configuration/view-report-clu/view-report-clu.component';
import {ViewReportPuntosComponent} from '../../components/configuration/view-report-puntos/view-report-puntos.component';


// SERVICES
import { LoadingIndicatorService } from '../../services/loading/loading-indicator.service';
import {DeleteComponent} from '../../components/common/modals/delete/delete.component';


@NgModule({
  declarations: [
    HomeComponent,
    AdminComponent,
    AdvertComponent,
    UserComponent,
    AddUsuarioComponent,
    CategoryComponent,
    AddCategoryComponent,
    TagComponent,
    AddTagComponent,
    TransferComponent,
    AddTransferenciaComponent,
    DenounceComponent,
    EditDenunciaComponent,
    PaymentComponent,
    StaticPagesComponent,
    EditPaginasEstaticasComponent,
    ConfigurationVariablesComponent,
    AddVariableConfiguracionComponent,
    TypeTransfersComponent,
    UserClassesComponent,
    EditClasesUsuariosComponent,
    ReportComponent,
    TipoTransferenciaAddComponent,
    TipoOpcionComponent,
    EditTipoOpcionComponent,
    MotivoDenunciaComponent,
    AddMotivoDenunciaComponent,
    FactoresbonificacionventasComponent,
    DeleteComponent,
  ViewReportsComponent,
    ViewReportCluComponent,
    ViewReportPuntosComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    AngularMaterialModule,
    UtilsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CKEditorModule
  ],
  entryComponents: [AngularMaterialModule],
  providers: [LoadingIndicatorService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class ConfigurationModule { }
