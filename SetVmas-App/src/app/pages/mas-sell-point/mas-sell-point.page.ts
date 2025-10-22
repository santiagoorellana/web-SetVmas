import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { Usuario } from '../../models/usuario.model';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-mas-sell-point',
  templateUrl: './mas-sell-point.page.html',
  styleUrls: ['./mas-sell-point.page.scss'],
})
export class MasSellPointPage implements OnInit {

  codigoComprador: any;
  puntos: number;
  userId: number;
  code: string;
  isConnected = false;
  barcodeScannerOptions: BarcodeScannerOptions = {
    showTorchButton: true,
    showFlipCameraButton: true
  };

  constructor(
    private modal: PopoverController, private service: AnuncioService,
    private networkService: NetworkService, public toastCtrl: ToastController,
    private barcodeScanner: BarcodeScanner
  ) { }

  ngOnInit() {
    this.checkConnection();
    this.service.currentUser.subscribe(user => {
      this.userId = user.UsuarioId;
      this.code = user.Codigo;
    });
  }

  ionViewWillEnter() {
    this.checkConnection();
  }

  async scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        this.codigoComprador = barcodeData.text;
      }).catch(err => { });
  }

  async close() {
    await this.modal.dismiss();
  }


  send() {
    if (this.code === this.codigoComprador) {
      this.presentToast('Usted mismo no puede venderse puntos, verifique el código.');
      return;
    }
    this.service.sellPoint(this.userId, this.codigoComprador, this.puntos).then(res => {
      console.log(res);
      this.service.refreshCurrentUser(() => { }, () => { });
      this.modal.dismiss();
      this.presentToast('Se ha realizado la venta correctamente.');
    }).catch(res => {
      this.presentToast('Ha ocurrido un error intentando vender puntos.');
    });
  }

  checkConnection() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
        console.log('Por favor enciende tu conexión a Internet');
      } else {

      }
    });
  }


  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

}
