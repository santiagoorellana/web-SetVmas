import { Component, ViewChild } from '@angular/core';
import { PopoverController, LoadingController, Platform, IonSelect, ToastController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { AnunciosModel } from '../../models/anuncios.model';
import { Usuario } from '../../models/usuario.model';
import { NetworkService } from '../../services/network.service';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as _ from 'lodash';
import * as moment from 'moment';
import { LocalDataService, StaticData } from '../../services/local-data.service';
import { MotivoDenuncia } from '../../models/motivo-denuncia.model';
import { Denuncia } from '../../models/denuncia.model';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {

  moment = moment;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3,
    loop: true,
    centeredSlides: true,
  };
  isConnected: boolean;
  currentUser: Usuario;
  anuncio: AnunciosModel;
  customAlertOptions: any = {
    header: 'Denunciar este anuncio',
    subHeader: 'Seleccione un motivo',
    translucent: true
  };
  reasons: MotivoDenuncia[];
  reported = false;

  @ViewChild('reportSelect', { static: false }) reportSelect: IonSelect;

  constructor(
    public popover: PopoverController, public network: Network, private service: AnuncioService,
    public loadingCtrl: LoadingController, private networkService: NetworkService, private localService: LocalDataService,
    public platform: Platform, private router: Router, private socialSharing: SocialSharing,
    public toastController: ToastController, private photoViewer: PhotoViewer, private iab: InAppBrowser) {
    if (_.get(this.router.getCurrentNavigation(), 'extras.state')) {
      this.anuncio = _.get(this.router.getCurrentNavigation(), 'extras.state.ad');
    }
  }

  checkConnetion() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  ionViewWillEnter() {
    this.checkConnetion();
    this.localService.getData((data: StaticData) => {
      this.reasons = data.reportReasons;
    });
    this.service.getCurrentUser().then((user: Usuario) => {
      this.currentUser = user;
    });
    this.service.addView(this.anuncio.AnuncioId).then(() => {
      this.anuncio.ContadorView += 1;
    });
  }

  openWeb(url) {
    const browser = this.iab.create(url, '_system');
    browser.show();
  }

  async presentPopover(ev: any) {
    this.reportSelect.open(ev);
  }

  ionChangeReport(ev) {
    if (!this.isConnected) {
      this.showMessage('Por favor verifique la conexión y vuelva a intentarlo.');
      return;
    }
    const report = new Denuncia(0, 'En Revisión', new Date(), new Date(),
      ev.detail.value, this.currentUser.UsuarioId, this.anuncio.AnuncioId);
    this.service.reportAd(report).then(() => {
      this.showMessage('Su denuncia ha sido procesada satisfactoriamente.');
      this.reported = true;
    });
  }

  async showMessage(message) {
    const toast = await this.toastController.create({
      message,
      duration: 10000,
    });
    toast.present();
  }

  sendShare(titulo?, id?) {
    const url = 'https://setvmas.com/#/detalles-anuncio/' + id;
    this.socialSharing.share(titulo, titulo, null, url);
  }

  openPhotoAd(name) {
    this.photoViewer.show(`https://setvmas.com/api/uploads/anuncios/${name}`);
  }

  openPhoto(name) {
    this.photoViewer.show(`https://setvmas.com/api/uploads/almacen/${name}`);
  }

}
