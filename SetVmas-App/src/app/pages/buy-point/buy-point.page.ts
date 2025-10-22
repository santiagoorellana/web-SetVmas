import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { NetworkService } from '../../services/network.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-buy-point',
  templateUrl: './buy-point.page.html',
  styleUrls: ['./buy-point.page.scss'],
})
export class BuyPointPage implements OnInit {

  loading: HTMLIonLoadingElement;
  userId: number;
  payType: any = 3;
  purchaseData: any;
  monto: number;
  phone: string;
  card: string;
  puntos: any;
  isConnected = false;

  constructor(
    public navCtrl: NavController, private service: AnuncioService,
    public toastCtrl: ToastController, private networkService: NetworkService,
    public loadingCtrl: LoadingController, private clipboard: Clipboard
  ) { }

  ngOnInit() { }

  async presentLoading(callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere...'
    });
    await this.loading.present();
    callback();
  }

  ionViewWillEnter() {
    this.presentLoading(() => {
      this.checkConnection();

      if (this.isConnected) {
        this.service.getPurchaseViewData().then(data => {
          this.purchaseData = data;
          this.changeMethod();
          if (this.loading) {
            this.loading.dismiss();
          }
        }).catch(err => {
          // this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo');
          if (this.loading) {
            this.loading.dismiss();
          }
        });
        this.service.currentUser.subscribe(user => this.userId = user.UsuarioId);

        if (this.loading) {
          this.loading.dismiss();
        }
      }
    });
  }

  checkConnection() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  changeMethod() {
    let min;
    if (this.payType === 1) {
      min = this.purchaseData.MinPointsBankTransfer;
    } else if (this.payType === 2) {
      min = this.purchaseData.MinPointsPhoneTransfer;
    } else {
      min = this.purchaseData.MinPointsDirectContact;
    }
    this.monto = min * this.purchaseData.PointPrice;
  }

  ccFormat(event) {
    const value = event.target.value;
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length > 0) {
      event.target.value = parts.join('-');
    } else {
      event.target.value = value;
    }
  }

  formatCard(value) {
    const parts = [];
    for (let i = 0, len = value.length; i < len; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    return parts.join('-');
  }

  validate() {
    let min;
    if (this.payType === 1) {
      min = this.purchaseData.MinPointsBankTransfer;
      if (!this.card || _.size(this.card) !== 19) {
        return false;
      }
    } else if (this.payType === 2) {
      min = this.purchaseData.MinPointsPhoneTransfer;
      if (!this.phone || _.size(this.phone) < 8) {
        return false;
      }
    } else {
      min = this.purchaseData.MinPointsDirectContact;
    }
    return this.monto >= min * this.purchaseData.PointPrice;
  }

  send() {
    this.service.buyPoint(this.payType, this.monto, this.card, this.phone, this.userId).then(res => {
      if (this.payType === 3) {
        this.presentToast('Usted será contactado por un agente de setvmas en las próximas 24 horas. También ha sido notificado por Correo Electrónico');
      } else {
        this.presentToast('Su compra ha sido registrada, realice la transferencia para que pueda ser confirmada y usted reciba sus puntos. También ha sido notificado por Correo Electrónico');
      }
      this.navCtrl.navigateForward('/virtual-office');
    }).catch(err => {
      this.presentToast('Por favor no se puede realizar la compra de puntos en estos momentos, compruebe tu conexión a Internet');
    });
  }

  copyToClipboard(value, message) {
    this.clipboard.copy(value);
    this.presentToast(message);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 10000
    });
    return await toast.present();
  }

  fixedValue(value, precision = 2) {
    const v = _.isString(value) ? parseFloat(value) : value;
    return v.toFixed(precision);
  }

}
