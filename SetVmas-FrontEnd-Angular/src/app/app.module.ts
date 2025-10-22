import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';/*CUSTOM_ELEMENTS_SCHEMA,*/


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { RoutingReferredModule } from 'src/app/modules/utils/routing-referred';


// MODULES
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './modules/utils/angular-material.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { UtilsModule } from './modules/utils/utils.module';
import { BotDetectCaptchaModule } from 'angular-captcha';


// COMPONENTS
import { MenuComponent } from './components/common/menu/menu.component';
import { ModalLoginComponent } from './components/common/modals/home/login/login.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlCro } from './modules/utils/mat_paginator';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {LoadingIndicatorService} from './services/loading/loading-indicator.service';
import { ModalRecoverAccountComponent } from './components/common/modals/home/recover-account/recover-account.component';
import { ModalRegisterComponent } from './components/common/modals/home/register/register.component';


// SERVICES
import { CategoryService } from './services/category/category.service';
import { EtiquetaService } from './services/tags/etiqueta.service';
import { PaginasEstaticasService } from './services/static-pages/paginas-estaticas.service';
import { UsuarioService } from './services/user/usuario.service';
import { DenunciaService } from './services/denounce/denuncia.service';
import { TransferenciaService } from './services/transfer/transferencia.service';
import { PagosService } from './services/payment/pagos.service';
import { ClasesUsuariosService } from './services/class-user/clases-usuarios.service';
import { CategoryTagsService } from './services/category-tags/category-tags.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptorService} from './modules/utils/auth-interceptor.service';
import {AnunciosService} from './services/advert/anuncios.service';
import {VariableConfiguracionBonificacionDsService} from './services/variable/variable-configuracion-bonificacion-ds.service';
import {VariableConfiguracionDsService} from './services/variable/variable-configuracion-ds.service';
import {VariableConfiguracionPagoDsService} from './services/variable/variable-configuracion-pago-ds.service';
import {VariableConfiguracion} from './models/variable-configuracion.model';
import {TipoTransferencia} from './models/tipo-transferencia.model';
import {TipoOpcionService} from './services/type-option/tipo-opcion.service';
import {FactoresbonificacionventasService} from './services/bonus-factors/factoresbonificacionventas.service';
import {VariableConfiguracionPuntosDsService} from './services/variable/variable-configuracion-puntos-ds.service';
import {VariableConfiguracionService} from './services/variable/variable-configuracion.service';
import {TipoTransferenciaService} from './services/transfer/type-transfer.service';
import { AssignBonusesService } from './services/office/assign-bonuses.service';
import { PurchaseService } from './services/office/purchase.service';
import { SellPointService } from './services/office/sell-points.service';
import { TransfersService } from './services/office/transfers.service';
import { ComplaintService } from './services/office/complaint.service';
import { MatNativeDateModule } from '@angular/material/core';
import { EmailConfirmComponent } from './components/common/modals/home/email-confirm/email-confirm.component';
import { AdvertService } from './services/office/advert.service';
import { ReferredDsService } from './services/office/referred-ds.service';

import {HashLocationStrategy,LocationStrategy} from '@angular/common';
import {ReportViewerModule} from 'ngx-ssrs-reportviewer';
import {RecaptchaModule,RecaptchaFormsModule} from 'ng-recaptcha';
import { RegistryReferredComponent } from './components/registry-referred/registry-referred.component';




@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ModalLoginComponent,
    ModalRecoverAccountComponent,
    ModalRegisterComponent,
    EmailConfirmComponent,
    RegistryReferredComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    AppRoutingModule,
    RoutingReferredModule,
    SlickCarouselModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    UtilsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BotDetectCaptchaModule,
    MatNativeDateModule,
    ReportViewerModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  entryComponents: [ AngularMaterialModule ] ,
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlCro
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    CategoryService,
    EtiquetaService,
    PaginasEstaticasService,
    UsuarioService,
    DenunciaService,
    PagosService,
    TransferenciaService,
    ClasesUsuariosService,
    CategoryTagsService,
    AnunciosService,
    VariableConfiguracionBonificacionDsService,
    VariableConfiguracionDsService,
    VariableConfiguracionPagoDsService,
    VariableConfiguracionPuntosDsService,
    VariableConfiguracionService,
    TipoTransferenciaService,
    TipoOpcionService,
    FactoresbonificacionventasService,
    AssignBonusesService,
    PurchaseService,
    SellPointService,
    TransfersService,
    ComplaintService,
    AdvertService,
    ReferredDsService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
   ],
  bootstrap: [AppComponent]

})

export class AppModule { }
