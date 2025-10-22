import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { SettingsService } from '../../services/settings.service';
import { Etiqueta } from '../../models/etiqueta.model';
import { Categoria } from '../../models/categoria.model';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AnunciosModel } from '../../models/anuncios.model';
import { LocalDataService, StaticData } from '../../services/local-data.service';
import { Usuario } from '../../models/usuario.model';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Almacenimagen } from '../../models/almacenimagen.model';
import { environment } from '../../../environments/environment';
import { Banner } from 'src/app/models/banner.model';
import { Opciones } from '../../models/opciones.model';
import { Router } from '@angular/router';
import { MunicipiosModel } from '../../models/municipios.model';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-announce',
  templateUrl: './edit-announce.page.html',
  styleUrls: ['./edit-announce.page.scss'],
})
export class EditAnnouncePage implements OnInit, AfterViewInit {

  pickAttrs = ['CantidadFrecuencia', 'MinimoComprar', 'NombreCodigo', 'TipoOpcionId', 'TextoLabel', 'Precio'];
  guestEmail = environment.guest;
  cameraOptions: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };

  galeryOptions: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  };

  AD_TAB = 'AD_TAB';
  OPTIONS_TAB = 'OPTIONS_TAB';
  tab = this.AD_TAB;
  ad: AnunciosModel = AnunciosModel.getEmpty();
  localities = [];
  categories: Array<Categoria> = [];
  configurations = {
    Max_Img_Free: 3
  };
  tags: Array<Etiqueta>;
  payedTags: Array<Etiqueta>;
  selectedPayedTags: Array<Etiqueta>;
  actionsAdd: Array<string>;
  options: any = {};
  activeOptions = false;
  currentUser: Usuario;
  mainImage: any;
  loading: HTMLIonLoadingElement;
  payImage: Almacenimagen;
  bannerDesktop: Banner;
  bannerMobile: Banner;
  isValid = false;
  toBuy = false;
  category: Categoria;

  @ViewChild('categorySelectAdd', { static: false }) categorySelectAdd: IonicSelectableComponent;
  @ViewChild('municipioSelectAdd', { static: false }) municipioSelectAdd: IonicSelectableComponent;

  payOptions = {
    destacado: {
      CantidadDias: 0,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'DESTACADO',
      OpcionAvanzadaId: 0,
      FechaDesactivacion: null
    },
    masEtiquetas: {
      CantidadDias: 0,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'ETIQUETAS',
      OpcionAvanzadaId: 0,
      FechaDesactivacion: null
    },
    autorenovar: {
      CantidadDias: 0,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'AUTO_24',
      OpcionAvanzadaId: 0,
      FechaDesactivacion: null
    },
    web: {
      CantidadDias: 0,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'ENLACE_WEB',
      OpcionAvanzadaId: 0,
      FechaDesactivacion: null
    },
    masImages: {
      CantidadDias: 0,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'IMG_ADI',
      OpcionAvanzadaId: 0,
      FechaDesactivacion: null
    },
    bannnerSuperior: {
      CantidadDias: 0,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'BAN_SUP',
      OpcionAvanzadaId: 0,
      FechaDesactivacion: null
    },
    bannerInferior: {
      CantidadDias: 0,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'BAN_INF',
      OpcionAvanzadaId: 0,
      FechaDesactivacion: null
    }
  };
  idAd: string;
  locality: MunicipiosModel;
  oldOptions: Opciones[];

  constructor(
    public service: AnuncioService,
    private servCo: SettingsService,
    public navCtrl: NavController,
    public platform: Platform,
    private localService: LocalDataService,
    private alertCtrl: AlertController,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private router: Router
  ) {
    if (_.get(this.router.getCurrentNavigation(), 'extras.state')) {
      this.idAd = _.get(this.router.getCurrentNavigation(), 'extras.state.ad');
    }
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    if (ev.detail.value === this.OPTIONS_TAB && !this.activeOptions) {
      return;
    }
    this.tab = ev.detail.value;
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

  async presentAlertConfirm(code) {
    const alert = await this.alertCtrl.create(_.merge({ buttons: ['OK'] }, environment.textsOptions[code]));
    alert.present();
  }

  changeAuto(ev) {
    this.payOptions.autorenovar = _.merge(this.payOptions.autorenovar, _.pick(this.options[ev.detail.value],
      this.pickAttrs));
  }

  changeMyWeb(ev) {
    if (ev.detail.checked) {
      // tslint:disable-next-line: no-string-literal
      this.payOptions.web = _.merge(this.payOptions.web, _.pick(this.options['MI_WEB'], this.pickAttrs));
    } else {
      // tslint:disable-next-line: no-string-literal
      this.payOptions.web = _.merge(this.payOptions.web, _.pick(this.options['ENLACE_WEB'], this.pickAttrs));
    }
    console.log(this.payOptions);
  }

  async presentLoading(callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere...'
    });
    await this.loading.present();
    callback();
  }

  loadPayOptions() {
    // cargando las opciones avanzadas
    for (const op of this.ad.OpcionesAvanzadas) {
      if (op.IsActivo) {
        switch (op.NombreCodigo) {
          case 'DESTACADO': {
            this.payOptions.destacado = op;
            this.payOptions.destacado.CantidadDias = 0;
            break;
          }
          case 'ETIQUETAS': {
            this.payOptions.masEtiquetas = op;
            this.selectedPayedTags = _.filter(this.ad.Etiquetas, { IsFree: false });
            this.payOptions.masEtiquetas.CantidadDias = 0;
            break;
          }
          case 'AUTO_24':
          case 'AUTO_6':
          case 'AUTO_1':
          case 'AUTO_TOP': {
            this.payOptions.autorenovar = op;
            this.payOptions.autorenovar.CantidadDias = 0;
            break;
          }
          case 'ENLACE_WEB':
          case 'MI_WEB': {
            this.payOptions.web = op;
            this.payOptions.web.CantidadDias = 0;
            break;
          }
          case 'IMG_ADI': {
            this.payOptions.masImages = op;
            this.payOptions.masImages.CantidadDias = 0;
            break;
          }
          case 'BAN_INF': {
            this.payOptions.bannerInferior = op;
            this.payOptions.bannerInferior.CantidadDias = 0;
            break;
          }
          case 'BAN_SUP': {
            this.payOptions.bannnerSuperior = op;
            this.payOptions.bannnerSuperior.CantidadDias = 0;
            break;
          }
        }
      }
    }
  }

  ngAfterViewInit() {
    this.presentLoading(() => {
      this.service.getAnunciosById(this.idAd).then(ad => {
        this.ad = ad;
        this.oldOptions = [];
        for (const op of this.ad.OpcionesAvanzadas) {
          this.oldOptions.push(_.clone(op));
        }
        if (this.ad.ImageName) {
          this.mainImage = `https://setvmas.com/api/uploads/anuncios/mini/${this.ad.ImageName}`;
        }
        this.loadPayOptions();
        _.each(_.clone(this.servCo.getProviciasAll()), (prov) => {
          _.each(prov.Municipios, (municipio) => {
            municipio.provincia = prov;
            this.localities.push(municipio);
          });
        });
        this.locality = _.find(this.localities, { Nombre: this.ad.Municipio });

        this.service.currentUser.subscribe(user => {
          this.currentUser = user || this.service.guest;
          if (!this.currentUser) {
            this.service.getGuest().then(guest => {
              this.currentUser = guest;
            });
          }
          console.log(this.currentUser);
        });

        this.localService.getData((data: StaticData) => {
          this.categories = _.clone(data.categories);
          // this.category = this.ad.Categoria;
          this.categoryChange({ component: this.categorySelectAdd, value: this.ad.Categoria });
          this.configurations = _.clone(data.configurations);
          if (this.loading) {
            this.loading.dismiss();
          }
        });
        this.actionsAdd = _.clone(this.servCo.getAccionesAnuncio());
        this.service.getTipoOpcions('', '', 'asc', 1, 5000).then(options => {
          for (const o of options) {
            this.options[o.NombreCodigo] = o;
          }
          console.log(this.options);

          for (let op of _.values(this.payOptions)) {
            op = _.merge(op, _.pick(this.options[op.NombreCodigo], this.pickAttrs));
          }
        });

        this.service.getEtiquetasAll('CantUsada', '', 'desc', 1, 5000)
          .then(res => {
            for (const tag of res) {
              tag.IsFree = false;
            }
            this.payedTags = res;
          });
      });
    });


  }

  municipioChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if (event.value) {
      this.ad.Municipio = event.value.Nombre;
      this.ad.Provincia = event.value.provincia.Nombre;
      this.validateAd();
    }
  }

  loadListMunicipios() {
    this.presentLoading(() => {
      setTimeout(() => {
        if (this.loading) {
          this.loading.dismiss();
        }
      }, 1100);
    });
  }

  categoryChange(event: {
    component: IonicSelectableComponent,
    value: Categoria
  }) {
    const cat: Categoria = _.clone(event.value);
    cat.Etiquetas = [];
    this.ad.Categoria = cat;
    this.presentLoading(() => {
      this.localService.getEtiquetasByCategoria(cat.CategoriaId).then((tags) => {
        for (const tag of tags) {
          tag.IsFree = true;
        }
        this.tags = tags;
        this.loading.dismiss();
      }).catch(err => {
        this.loading.dismiss();
        this.presentToast(`Lo sentimos ha ocurrido un error intentando cargar la lista de etiquetas, verifique la conexión e intente de nuevo.`);
      });
    });
    this.validateAd();
  }

  changePayedTags(event: {
    component: IonicSelectableComponent,
    value: Array<Etiqueta>
  }) {
    this.ad.Etiquetas = _.concat(this.ad.Etiquetas, event.value);
  }

  validateAd() {
    if (!this.ad.Titulo || !this.ad.Accion || !this.ad.Categoria
      || this.ad.Etiquetas.length === 0 || !this.ad.CorreoContacto || !this.ad.NombreContacto
      || !this.ad.TelefonoContacto || !this.ad.Municipio) {
      this.isValid = false;
      this.activeOptions = false;
      console.log(this.activeOptions);
      return;
    } else {
      this.isValid = true;
    }

    if (this.currentUser.Correo !== environment.guest) {
      this.activeOptions = true;
    }
    console.log(this.activeOptions);
  }

  clear() {
    this.municipioSelectAdd.clear();
    this.categorySelectAdd.clear();
    this.tags = [];
  }

  save() {
    this.presentLoading(() => {
      if (this.currentUser.Correo !== environment.guest) {
        const pointsToPay = this.calculate();
        if (pointsToPay > 0 && pointsToPay <= this.currentUser.Puntos) {
          this.loadPayOptionsToSave();
          this.currentUser.Puntos -= pointsToPay;
          this.ad.Usuario = this.currentUser;
        } else if (pointsToPay > 0 && pointsToPay > this.currentUser.Puntos) {
          const toBuy = pointsToPay - this.currentUser.Puntos;
          this.presentToast(`Debe comrpar ${toBuy.toFixed(2)} puntos para adicionar este anuncio o reajustar las opciones avanzadas.`);
          if (this.loading) {
            this.loading.dismiss();
          }
          return;
        }
      }
      if (!(this.ad.Precio > 0)) {
        this.ad.Precio = 0;
      }
      this.ad.FechaModificacion = new Date();
      console.log(this.ad);
      this.service.updateAnuncio(this.ad.AnuncioId, this.ad).then(res => {
        console.log(res);
        // alert(JSON.stringify(res));
        if (this.loading) {
          this.loading.dismiss();
        }
        this.navCtrl.navigateForward('/virtual-office');
      }).catch(err => {
        console.log(err);
        if (this.loading) {
          this.loading.dismiss();
        }
        this.presentToast(`Lo sentimos ha ocurrido un error intentando guardar su anuncio, verifique la conexión e intente de nuevo.`);
      });
    });
  }

  removeUrl(event, optionKey) {
    if (!event.detail.checked) {
      this.ad.Url = '';
    }
    this.changeCheck(event, optionKey);
  }

  loadPayOptionsToSave() {
    this.ad.OpcionesAvanzadas = [];
    for (const option of _.values(this.payOptions) as Opciones[]) {
      const op = _.clone(option);
      if (op.IsActivo) {
        switch (op.NombreCodigo) {
          case 'IMG_ADI': {
            if (this.payImage) {
              this.ad.AlmacenImagen.push(this.payImage);
            }
            break;
          }
          case 'BAN_SUP': {
            if (this.bannerDesktop && this.bannerMobile) {
              this.ad.Banners.push(this.bannerDesktop);
              this.ad.Banners.push(this.bannerMobile);
            }
            break;
          }
          default: {
            if (op.OpcionAvanzadaId > 0) {
              const old = _.find(this.oldOptions, { OpcionAvanzadaId: op.OpcionAvanzadaId });
              if (old && old.CantidadDias > 0) {
                op.CantidadDias += old.CantidadDias;
              }
            }
            this.ad.OpcionesAvanzadas.push(op);
            break;
          }
        }
      }
    }
  }

  mainPhoto(option: CameraOptions) {
    const mainOptions = _.merge(option, {
      targetWidth: 166,
      targetHeight: 322
    });
    this.camera.getPicture(mainOptions).then((imageData) => {
      this.mainImage = null;
      this.mainImage = 'data:image/jpeg;base64,' + imageData;
      this.ad.ImageContent = this.mainImage;
      this.ad.ImageName = new Date().getTime() + '.jpg';
      this.ad.ImageMimeType = 'image/jpeg';
    }, (err) => {
      console.log(err);
    });
  }

  removeMainPhoto() {
    this.mainImage = null;
    delete this.ad.ImageContent;
    delete this.ad.ImageName;
    delete this.ad.ImageMimeType;
  }

  freeAditionalPhoto(option) {
    this.camera.getPicture(option).then((imageData) => {
      const data = 'data:image/jpeg;base64,' + imageData;
      const image = new Almacenimagen(0, data, data, 'image/jpeg', new Date().getTime() + '.jpg', 0, true, 1);
      this.ad.AlmacenImagen.push(image);
    }, (err) => {
      console.log(err);
    });
  }

  removeFreeAditionalPhoto(imageName) {
    const images = [];
    for (const image of this.ad.AlmacenImagen) {
      if (image.ImageName !== imageName) {
        images.push(image);
      }
    }
    this.ad.AlmacenImagen = images;
  }

  payAditionalPhoto(option, container) {
    let customOptions = option;
    if (container === 'bannerDesktop') {
      customOptions = _.merge(option, {
        targetWidth: 1170,
        targetHeight: 166
      });
    } else if (container === 'bannerMobile') {
      customOptions = _.merge(option, {
        targetWidth: 322,
        targetHeight: 166
      });
    }
    this.camera.getPicture(customOptions).then((imageData) => {
      const data = 'data:image/jpeg;base64,' + imageData;
      _.set(this, container, new Almacenimagen(0, data, data, 'image/jpeg', new Date().getTime() + '.jpg', 0, false, 1));
    }, (err) => {
      console.log(err);
    });
  }

  removePayAditionalPhoto(container) {
    _.set(this, container, null);
  }

  checkBannerInf(event, optionKey) {
    if (!this.ad.ImageName) {
      event.stopPropagation();
      this.presentToast('Debe insertar la imagen principal del anuncio para activar esta opción.');
      setTimeout(() => this.payOptions.bannerInferior.IsActivo = false, 100);
    }
    this.changeCheck(event, optionKey);
  }

  calculate() {
    let total = 0;
    for (const op of _.values(this.payOptions)) {
      if (op.IsActivo && op.CantidadDias > 0) {
        total += op.CantidadDias * op.Precio;
      }
    }
    this.toBuy = total > 0 && this.currentUser && total > this.currentUser.Puntos;
    return total;
  }

  diffDays(date) {
    const diffDays = moment(date).diff(moment().startOf('day'), 'day');
    if (diffDays < 1) {
      const diffMins = moment(date).diff(moment().startOf('day'), 'minutes');
      const hours = _.round(diffMins / 60, 0);
      const mins = diffMins % 60;
      if (hours > 0) {
        return `Quedan ${hours} horas.`;
      }
      if (mins > 0) {
        return `Quedan ${mins} minutos.`;
      }

      return 'Queda menos de un minuto.';
    }
    return diffDays === 1 ? `Queda 1 día.` : `Quedan ${diffDays} días.`;
  }

  changeCheck(event, optionKey) {
    if (!event.detail.checked) {
      const blankOption = {
        CantidadDias: 0,
        IsActivo: false,
        Precio: null,
        NombreCodigo: '',
        OpcionAvanzadaId: 0,
        FechaDesactivacion: null
      };
      blankOption.NombreCodigo = this.payOptions[optionKey].NombreCodigo;
      this.payOptions[optionKey] = blankOption;

      if (optionKey === 'masEtiquetas') {
        this.selectedPayedTags = [];
      }
    }
  }


}
