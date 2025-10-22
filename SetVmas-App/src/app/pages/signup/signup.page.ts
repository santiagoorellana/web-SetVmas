import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ToastController, NavController, PopoverController, LoadingController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ConfirmAccountPage } from '../confirm-account/confirm-account.page';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  anfitrion: any;
  email: any;
  password: any;
  confirmpassword: any;
  telephone: any;
  isConnected = false;
  error = false;
  captchaPassed = false;
  captchaResponse: string;
  barcodeScannerOptions: BarcodeScannerOptions = {
    showTorchButton: true,
    showFlipCameraButton: true
  };
  loading: HTMLIonLoadingElement;

  @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;
  constructor(
    private toastr: ToastController,
    private servAnuncio: AnuncioService,
    private networkService: NetworkService,
    public navCtrl: NavController,
    private modal: PopoverController,
    private zone: NgZone,
    private barcodeScanner: BarcodeScanner,
    public loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.checkConnection();
  }

  async scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        if (barcodeData && _.startsWith(barcodeData.text, environment.refUrl)) {
          this.anfitrion = _.replace(barcodeData.text, environment.refUrl, '');
        } else {
          this.anfitrion = barcodeData.text;
        }
      }).catch(err => { });
  }

  confirmPassword() {
    if (this.password !== this.confirmpassword) {
      this.error = true;
    } else {
      this.error = false;
    }
  }

  checkConnection() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  captchaResolved(response: string): void {
    this.zone.run(() => {
      this.captchaPassed = true;
      this.captchaResponse = response;
    });
  }

  register() {
    if (!this.isConnected) {
      this.presentToast('Por favor enciende tu conexión a Internet');
      return;
    }
    this.presentLoading('Por favor, espere...', () => {
      this.servAnuncio.register(this.email, this.password, this.anfitrion, this.telephone, this.captchaResponse).then(res => {
        this.presentToast('Ud ha recibido un correo, por favor verifique su cuenta. Registrarse');
        this.loading.dismiss();
        this.confirmAccount();
      }).catch(error => {
        this.loading.dismiss();
        this.presentToast('Ya existe un usuario registrado con ese correo, Registrarse');
      });
    });
  }

  async confirmAccount() {
    const modal = await this.modal.create({
      component: ConfirmAccountPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastr.create({
      message,
      duration: 5000
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
