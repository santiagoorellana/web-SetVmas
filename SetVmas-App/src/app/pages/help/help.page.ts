import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { SettingsService } from '../../services/settings.service';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PaginasEstaticasModel } from '../../models/paginas-estaticas.model';
import { VariableConfiguracion } from '../../models/variable-configuracion.model';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';


@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  formData: PaginasEstaticasModel = new PaginasEstaticasModel(0, '', '');
  help = false;
  isConnected = false;
  nosotro: any;
  ayudar: any;
  loading: HTMLIonLoadingElement;

  constructor(
    public navCtrl: NavController,
    private insomnia: Insomnia,
    public network: Network, private servAnuncio: AnuncioService,
    private networkService: NetworkService, public loadingCtrl: LoadingController,
    private sanitizer: DomSanitizer, public toastCtrl: ToastController
  ) {
  }

  ngOnInit() {
    // this.checkConnection();
    // this.insomnia.keepAwake().then(() => {
    //   console.log('success');
    // });
    this.presentLoading('Cargando la ayuda...', () => {
      this.checkConnection();
      this.ayudas();
    });
  }

  async presentLoading(message, callback) {
    this.loading = await this.loadingCtrl.create({
      message
    });
    await this.loading.present();
    callback();
  }

  ionViewWillEnter() {
    this.checkConnection();
  }

  checkConnection() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

  termino() {
    this.presentLoading('Cargando...', () => {
      const id = 2;
      this.servAnuncio.getPaginasEstaticasByid(id).then(res => {
        this.formData = res as PaginasEstaticasModel;
        this.help = false;
        this.loading.dismiss();
      }).catch(() => {
        this.loading.dismiss();
        this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
      });
    });
  }

  nosotros() {
    this.presentLoading('Cargando...', () => {
      const id = 3;
      this.servAnuncio.getPaginasEstaticasByid(id).then(res => {
        this.formData = res as PaginasEstaticasModel;
        this.nosotro = this.sanitizer.bypassSecurityTrustHtml(this.formData.Contenido);
        console.log(this.nosotro);
        this.help = false;
        this.loading.dismiss();
      }).catch(() => {
        this.loading.dismiss();
        this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
      });
    });
  }

  puntos() {
    this.presentLoading('Cargando...', () => {
      const id = 6;
      this.servAnuncio.getPaginasEstaticasByid(id).then(res => {
        this.formData = res as PaginasEstaticasModel;
        this.help = false;
        this.loading.dismiss();
      }).catch(() => {
        this.loading.dismiss();
        this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
      });
    });
  }

  respuestas() {
    this.presentLoading('Cargando...', () => {
      const id = 4;
      this.servAnuncio.getPaginasEstaticasByid(id).then(res => {
        this.formData = res as PaginasEstaticasModel;
        this.help = false;
        this.loading.dismiss();
      }).catch(() => {
        this.loading.dismiss();
        this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
      });

    });
  }



  ayudas() {
    const valor = 'Txt_Ayuda_app';
    this.servAnuncio.getVariableConfiguracionByCodigo(valor).then(res => {
      this.ayudar = res as VariableConfiguracion;
      this.help = true;
      this.loading.dismiss();
    }).catch(() => {
      this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
    });
  }

}
