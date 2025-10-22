import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { PaginasEstaticasModel } from '../../models/paginas-estaticas.model';
import { Banner } from '../../models/banner.model';
import { Usuario } from '../../models/usuario.model';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  isConnected = false;

  nombre: any;
  email: any;
  asunto: any;
  texto: any;
  formData: PaginasEstaticasModel = new PaginasEstaticasModel(0, '', '');
  captchaPassed = false;
  captchaResponse: string;

  @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;

  constructor(
    private toast: ToastController,
    private servAnuncio: AnuncioService,
    private networkService: NetworkService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.checkConnetion(() => {
      if (this.isConnected) {
        this.servAnuncio.getPaginasEstaticasByid(5).then(res => {
          this.formData = res as PaginasEstaticasModel;
          console.log(this.formData);
        });
      } else {
        this.formData = {
          Contenido: 'Para contactar directamente al equipo de trabajo y administración Setvmas, ' +
            'el sitio de los anuncios clasificados de Cuba.',
          PaginasEstaticasId: 5,
          Titulo: 'Contáctanos'
        };
      }
    });
  }

  captchaResolved(response: string): void {
    this.zone.run(() => {
      this.captchaPassed = true;
      this.captchaResponse = response;
    });
  }

  checkConnetion(callback = (status) => { }) {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      callback(connected);
    });
  }

  send() {
    this.servAnuncio.enviarCorreo(this.nombre, this.email, this.asunto, this.texto, this.captchaResponse).then(res => {
      this.presentToast();
      this.clear();
    });
  }

  clear() {
    this.nombre = null;
    this.email = null;
    this.asunto = null;
    this.texto = null;
  }

  validate() {
    return this.nombre && this.asunto && this.email && this.texto && this.captchaPassed;
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: 'Correo enviado.',
      duration: 5000
    });
    toast.present();
  }

}
