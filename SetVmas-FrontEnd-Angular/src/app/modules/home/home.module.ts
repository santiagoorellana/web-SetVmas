import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULES
import { HomeRoutingModule } from './home-routing.module';
import { AngularMaterialModule } from '../utils/angular-material.module';
import { UtilsModule } from '../utils/utils.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';


// COMPONENTS
import { HomeComponent } from '../../components/home/home/home.component';
import { FiltersComponent } from '../../components/common/filters/filters.component';
import { InitialComponent } from '../../components/home/initial/initial.component';
import { OfficeComponent } from '../../components/home/office/office.component';
import { AppHomeComponent } from '../../components/home/app-home/app-home.component';
import { HelpComponent } from '../../components/home/help/help.component';
import {LoadingIndicatorService} from '../../services/loading/loading-indicator.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {QrCodeComponent} from '../../components/common/modals/office/qr-code/qr-code.component';
import {QRCodeModule} from 'angularx-qrcode';
import {ViewStaticPagesComponent} from '../../components/home/static-pages/view-static-pages/view-static-pages.component';
import { SellPointsComponent } from 'src/app/components/common/modals/office/sell-points/sell-points.component';
import { DirectPurchaseComponent } from 'src/app/components/common/modals/office/direct-purchase/direct-purchase.component';
import { AssignBonusesComponent } from 'src/app/components/common/modals/office/assign-bonuses/assign-bonuses.component';
import { TransfersComponent } from 'src/app/components/common/modals/office/transfers/transfers.component';
import { ComplaintsComponent } from 'src/app/components/common/modals/office/complaints/complaints.component';
import { ClassifyAnunceComponent } from 'src/app/components/common/modals/office/classify-anunce/classify-anunce.component';
import { MatNativeDateModule } from '@angular/material/core';
import { BgImageDirective } from 'src/app/directives/bg-image.directive';
import { BannerFooterComponent } from 'src/app/components/common/banner-footer/banner-footer.component';
import { EditarAnunciosComponent } from 'src/app/components/common/modals/advert/editar-anuncios/editar-anuncios.component';
import {DetailAdvertComponent} from '../../components/common/detail-advert/detail-advert.component';
import {SafeUrlPipe} from '../../components/common/safe-url.pipe';
import { AdDetailsComponent } from 'src/app/components/home/ad-details/ad-details.component';
import {BannerHeaderComponent} from '../../components/common/slide-header/slide-header.component';
import {FileUploadComponent} from '../../components/common/modals/advert/common/fileUpload';


import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {RecaptchaModule, RecaptchaFormsModule} from 'ng-recaptcha';
import {QrEnzonaComponent} from '../../components/common/modals/office/qr-enzona/qr-enzona.component';
import {RegistryReferredComponent} from "../../components/registry-referred/registry-referred.component";
import {QRTransferMovilComponent} from "../../components/common/modals/office/qrtransfer-movil/qrtransfer-movil.component";


@NgModule({
  declarations: [
    HomeComponent,
    FiltersComponent,
    InitialComponent,
    OfficeComponent,
    AppHomeComponent,
    HelpComponent,
    QrCodeComponent,
    ViewStaticPagesComponent,
    SellPointsComponent,
    DirectPurchaseComponent,
    AssignBonusesComponent,
    TransfersComponent,
    ComplaintsComponent,
    ClassifyAnunceComponent,
    BgImageDirective,
    BannerFooterComponent,
    EditarAnunciosComponent,
    FileUploadComponent,
    DetailAdvertComponent,
    SafeUrlPipe,
    AdDetailsComponent,
    BannerHeaderComponent,
    QrEnzonaComponent,
    QRTransferMovilComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularMaterialModule,
    UtilsModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    SlickCarouselModule,
    QRCodeModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  entryComponents: [AngularMaterialModule],
  providers: [LoadingIndicatorService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }]
})
export class HomeModule { }
