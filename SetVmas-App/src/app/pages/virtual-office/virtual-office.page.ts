import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, LoadingController, AlertController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { AnunciosModel } from '../../models/anuncios.model';
import { NetworkService } from '../../services/network.service';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { MasqrPage } from '../masqr/masqr.page';
import { MasSellPointPage } from '../mas-sell-point/mas-sell-point.page';
import * as moment from 'moment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-virtual-office',
  templateUrl: './virtual-office.page.html',
  styleUrls: ['./virtual-office.page.scss'],
})
export class VirtualOfficePage implements OnInit {

  AD_TAB = 'AD_TAB';
  DATA_TAB = 'DATA_TAB';
  tab = this.DATA_TAB;
  moment = moment;

  nube = 'cloud-outline';
  isConnected = false;
  anuncios: AnunciosModel[];
  compras = 0;

  codigo: any;
  cantReferidos: any;
  iduser: any;
  precioPunto: string;
  messageAdmin: string;
  clase: any;
  acumuladoPuntos: any;
  nameUser: any;
  loading: HTMLIonLoadingElement;

  constructor(
    public navCtrl: NavController, private service: AnuncioService,
    private networkService: NetworkService, private modal: PopoverController,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    private alertCtrl: AlertController, private clipboard: Clipboard, private iab: InAppBrowser
  ) {
  }

  segmentChanged(ev: any) {
    this.tab = ev.detail.value;
  }

  ngOnInit() {
  }

  refresh() {
    this.service.refreshCurrentUser(() => { }, () => { });
  }

  ionViewWillEnter() {
    this.checkConnection();
    this.presentLoading('Cargando tus anuncios...', () => {
      this.service.currentUser.subscribe(user => {
        if (user) {
          const index = user.Correo.indexOf('@');
          this.codigo = user.Codigo;
          this.cantReferidos = user.CantReferidos;
          this.iduser = user.UsuarioId;
          this.clase = user.Clase;
          this.acumuladoPuntos = user.Puntos;
          if (index !== -1) {
            this.nameUser = user.Correo.substr(0, index);
          }
          this.loadOnline();
          this.precioPuntos();
          this.loadMessageAdmin();
          this.service.getUsuarioVolumenCompraByUser(user.UsuarioId).then(value => this.compras = value);
        }
      });
    });

  }
  enlace() {
    const userCodigo = environment.refUrl + this.codigo;
    this.clipboard.copy(userCodigo);
    this.presentToast('Copiado enlace de referido.');
  }


  precioPuntos() {
    this.service.getVariableConfiguracionByCodigo('Precio_Puntos').then(res => {
      this.precioPunto = parseFloat(res.Valor).toFixed(2);
      console.log(this.precioPunto);
    }).catch((error) => {
      this.presentToast('Lo sentimos no hemos podido obtener todos los datos, verifique su conexión e intente de nuevo.');
    });
  }
  loadMessageAdmin() {
    this.service.getVariableConfiguracionByCodigo('MEN_ADM_OV').then(res => {
      this.messageAdmin = res.Valor;
    }).catch((error) => {
      this.presentToast('Lo sentimos no hemos podido obtener todos los datos, verifique su conexión e intente de nuevo.');
    });
  }

  changeStatusAd(ad: AnunciosModel) {
    this.service.ocultarMostrarAnuncio(ad.AnuncioId).then(() => {
      ad.IsActivo = !ad.IsActivo;
      ad.IsVisible = !ad.IsVisible;
      this.presentToast(ad.IsActivo
        ? 'El anuncio ha sido activado satisfactoriamente.'
        : 'El anuncio ha sido desactivado satisfactoriamente.'
      );
    }).catch(() => this.presentToast('Error durante la actualización de anuncio'));
  }

  checkConnection() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
        this.nube = 'cloud-outline';

      } else {
        this.nube = 'cloud-done';
      }
    });
  }

  loadOnline() {
    this.service.getAnunciosByUser('FechaModificacion', this.iduser, 'asc', 1, 100).then(data => {
      this.anuncios = data;
      console.log(this.anuncios);
      if (this.loading) {
        this.loading.dismiss();
      }
    }).catch(() => {
      if (this.loading) {
        this.loading.dismiss();
      }
      this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: ' <strong>¿Seguro que desea salir de su usuario en Setvmas?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.navCtrl.navigateForward('/home');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.service.currentUser = null;
          }
        }
      ]
    });

    await alert.present();
  }

  onAnnounce() {
    console.log('Announce');
    this.navCtrl.navigateForward('/add-announce');
  }

  onDeleteAnnounce(anuncioId) {
    if (this.isConnected) {
      this.presentLoading('Por favor, espere...', () => {
        this.service.deleteAnuncio(anuncioId).then(() => {
          // this.anuncios = data as AnunciosModel;
          console.log(this.anuncios);
          this.loadOnline();
        }).catch((error) => {
          if (this.loading) {
            this.loading.dismiss();
          }
          this.presentToast('Lo sentimos ha ocurrido un error intentando eliminar el anuncio, verifique la conexión e intente de nuevo.');
        });
      });
    } else {
      this.presentToast('Por favor, verifique la conexión e intente de nuevo.');
    }
  }

  compra() {
    this.navCtrl.navigateForward('/buy-point');
    this.compras++;
  }

  editAd(ad: AnunciosModel) {
    this.navCtrl.navigateForward('/edit-announce', { state: { ad: ad.AnuncioId } });
  }

  async vende() {
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

  openWeb() {
    const browser = this.iab.create(environment.webURL + '#/oficina', '_system');
    browser.show();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

  async presentLoading(message, callback) {
    this.loading = await this.loadingCtrl.create({
      message
    });
    await this.loading.present();
    callback();
  }
}
