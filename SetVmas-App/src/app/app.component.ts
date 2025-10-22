import { Component } from '@angular/core';
import { Platform, PopoverController, ToastController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkService } from './services/network.service';
import { AnuncioService } from './services/anuncio.service';
import { MasqrPage } from './pages/masqr/masqr.page';
import { MasSellPointPage } from './pages/mas-sell-point/mas-sell-point.page';
import { Usuario } from './models/usuario.model';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { map, take } from 'rxjs/operators';
import { CodePush, SyncStatus } from '@ionic-native/code-push/ngx';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isConnected = false;
  currentUser: Usuario;
  userPoint = 0;
  firstTime = true;

  constructor(
    private platform: Platform, private statusBar: StatusBar, private networkService: NetworkService,
    private modal: PopoverController, public service: AnuncioService, private insomnia: Insomnia,
    private codePush: CodePush, public toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  checkConnection() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // let status bar overlay webview
      // this.statusBar.overlaysWebView(true);

      // set status bar to white
      this.statusBar.backgroundColorByHexString('#000030');
      this.checkConnection();
      this.codePush.sync({ deploymentKey: environment.deploymentKey }).subscribe(status => {
        switch (status.valueOf()) {
          case SyncStatus.DOWNLOADING_PACKAGE:
            this.presentToast('Se ha encontrado una nueva actualización, se aplicará de inmediato.');
            break;
          case SyncStatus.UPDATE_INSTALLED:
            localStorage.setItem('UPDATE_INSTALLED_SETVMAS_APP', 'OK');
            break;
        }
      });
      this.service.getLocalCurrentUser();
      this.service.currentUser.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.userPoint = user.Puntos;
          if (this.firstTime) {
            this.service.relogin();
            this.firstTime = false;
          }
        } else {
          if (this.isConnected) {
            this.service.getGuest();
          }
        }
      });

      this.insomnia.keepAwake();
    });
  }

  async sell() {
    const modal = await this.modal.create({
      component: MasSellPointPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async qr() {
    const modal = await this.modal.create({
      component: MasqrPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

}
