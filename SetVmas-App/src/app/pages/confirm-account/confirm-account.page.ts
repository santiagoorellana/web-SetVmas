import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController, NavController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.page.html',
  styleUrls: ['./confirm-account.page.scss'],
})
export class ConfirmAccountPage implements OnInit {

  confirmCode: string;
  isConnected: boolean;

  constructor(
    private modal: PopoverController,
    private service: AnuncioService,
    private networkService: NetworkService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.checkConnection();
  }

  confirm() {
    if (this.isConnected) {
      this.service.confirmar(this.confirmCode).then(user => {
        if (user && user.UsuarioId !== 0) {
          this.presentToast('Se ha verificado su correo satisfactoriamente.');
          this.navCtrl.navigateForward('/signin');
          this.close();
        } else {
          this.presentToast('El código de verificación no es correcto. Intente nuevamente.');
        }
      }).catch(err => {
        this.presentToast('El código de verificación no es correcto. Intente nuevamente.');
      });
    }
  }

  async close() {
    await this.modal.dismiss();
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
