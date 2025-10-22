import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsService } from './services/settings.service';
import { NetworkService } from './services/network.service';
import { Network } from '@ionic-native/network/ngx';
import { AnuncioService } from './services/anuncio.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormsModule } from '@angular/forms';
import { MasSellPointPage } from './pages/mas-sell-point/mas-sell-point.page';
import { MasqrPage } from './pages/masqr/masqr.page';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { DatePipe } from '@angular/common';
import { InterceptorService } from './services/interceptor.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { QRCodeModule } from 'angularx-qrcode';
// import { RecaptchaModule } from 'ng-recaptcha';
import { TimeoutInterceptor, DEFAULT_TIMEOUT } from './services/timeout-interceptor.service';
import {CodePush } from '@ionic-native/code-push/ngx';

@NgModule({
  declarations: [AppComponent, MasqrPage, MasSellPointPage],
  entryComponents: [MasqrPage, MasSellPointPage],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    QRCodeModule,
    // RecaptchaModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Clipboard,
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DatePipe,
    InAppBrowser,
    SocialSharing,
    Insomnia,
    SettingsService,
    AnuncioService,
    Network,
    NetworkService,
    CodePush,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
    [{ provide: DEFAULT_TIMEOUT, useValue: 30000 }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
