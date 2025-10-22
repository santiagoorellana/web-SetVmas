import { Component, ViewChild, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { LoadingController, NavController, Platform, IonContent } from '@ionic/angular';
import { AnunciosModel } from '../../models/anuncios.model';
import { SettingsService } from '../../services/settings.service';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { ToastController } from '@ionic/angular';
import { Banner } from '../../models/banner.model';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, AlertController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import { BuscarAnunciosModel } from '../../models/buscar-anuncios.model';
import { LocalDataService, StaticData } from '../../services/local-data.service';
import { environment } from '../../../environments/environment';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  _ = _;
  rootURL = environment.rootURLImages;
  RECENTS_TAB = 'RECENTS';
  MOST_SEEN_TAB = 'MOST_SEEN';
  tab = this.RECENTS_TAB;

  slideOpts = {
    initialSlide: 0,
    slidePerView: 1,
    speed: 3000,
    autoplay: true,
    enablekeyboardcontroll: true
  };
  subscription;
  isConnected = false;
  bannersTop: Banner[] = [];
  bannersBottom: Banner[] = [];
  searchText = '';

  mostSeen: AnunciosModel[];
  mostSeenPage = 1;
  recents: AnunciosModel[];
  recentsPage = 1;
  pagination = 21;
  loading = false;
  loadingBannerTop = true;
  loadingBannerBottom = true;
  skeletorCard = [];
  enableFilterButton = false;
  filters: BuscarAnunciosModel;
  lastTimeBackPress = 0;
  WifiWizard2: any;
  loadFirstTime = false;
  screenWidth: number;
  isInPause = false;

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  lastEvent: any;

  constructor(
    private platform: Platform, private splashScreen: SplashScreen,
    private servCo: SettingsService, public servAnuncio: AnuncioService,
    private networkService: NetworkService,
    public toastCtrl: ToastController, private alertCtrl: AlertController,
    public modalController: ModalController, private iab: InAppBrowser,
    public loadingCtrl: LoadingController, private socialSharing: SocialSharing,
    private localService: LocalDataService, public navCtrl: NavController
  ) {
  }

  getRows(items) {
    if (!items) {
      return [];
    }
    let countColumns = _.round(this.screenWidth / 360, 0);
    if (countColumns > 3) {
      countColumns = 3;
    }
    const rows = _.chunk(items, countColumns);
    const lastRowSize = _.size(_.last(rows));
    if (lastRowSize < countColumns) {
      const fillRow = _.fill(Array(countColumns - lastRowSize), null);
      rows[rows.length - 1] = _.concat(_.last(rows), fillRow);
    }

    return rows;
  }

  ngOnInit(): void {
    if (localStorage.getItem('UPDATE_INSTALLED_SETVMAS_APP')) {
      localStorage.removeItem('UPDATE_INSTALLED_SETVMAS_APP');
      this.presentToast('La aplicación se ha actualizado a su última versión satisfactoriamente.');
    }
    this.platform.pause.subscribe(() => {
      this.isInPause = true;
    });
    this.platform.resume.subscribe(() => {
      setTimeout(() => {
        this.isInPause = false;
      }, 300);
    });

    this.skeletorCard = [];
    const cardCount = parseInt(((window.innerHeight - 190) / 142).toFixed(0), 0) + 1;
    for (let index = 0; index < cardCount; index++) {
      this.skeletorCard.push({});
    }
    this.screenWidth = window.innerWidth;
    this.pagination = this.servCo.getCantPorPaginasHome() * _.round(this.screenWidth / 360);
    this.servAnuncio.filters.subscribe(newFilters => {
      this.checkConnetion((status) => {
        if (!this.loadFirstTime) {
          if (!this.loading && this.isConnected) {
            this.localService.getData((data: StaticData) => {
              this.enableFilterButton = true;
              // this.loadFirstTime = true;
            });
          }
        }
        if (_.size(_.keys(newFilters)) > 0 && !_.isEqual(newFilters, this.filters)) {
          this.filters = _.clone(newFilters) || {};
          this.applyFilters();
        } else if (_.size(_.keys(newFilters)) === 0) {
          this.filters = {};
          if (this.loadFirstTime) {
            this.applyFilters();
          }
        }
      });
    });

  }

  segmentChanged(ev: any) {
    if (this.tab !== ev.detail.value) {
      const c: any = document.getElementById('pageContent');
      if (c) {
        c.scrollToTop();
      }
      this.infiniteScroll.disabled = false;
    }
    this.tab = ev.detail.value;
    if (this.tab === this.RECENTS_TAB && _.size(this.recents) === 0) {
      this.loadRecents();
    } else if (this.tab === this.MOST_SEEN_TAB && _.size(this.mostSeen) === 0) {
      this.loadMostSeen();
    }
  }

  applyFilters(page = 1) {
    if (page === 1) {
      this.loading = true;
    }
    this.searchText = '';
    this.recents = [];
    this.mostSeen = [];
    if (this.tab === this.RECENTS_TAB) {
      console.log(this.recents);
      this.recentsPage = page;
      this.loadRecents();
    } else if (this.tab === this.MOST_SEEN_TAB) {
      this.mostSeenPage = page;
      this.loadMostSeen();
    }
  }

  ionViewWillEnter() {
    if (localStorage.getItem('SETVMAS_SEARCH_TEXT')) {
      this.searchText = localStorage.getItem('SETVMAS_SEARCH_TEXT');
    }
    if (this.servAnuncio.resetScroll) {
      const c: any = document.getElementById('pageContent');
      if (c) {
        c.scrollToTop();
      }
      this.servAnuncio.resetScroll = false;
      this.infiniteScroll.disabled = false;
    }
    if (!this.loadFirstTime) {
      this.platform.ready().then(async () => {
        this.splashScreen.hide();
        this.loadAuto();
      });
    }
  }

  loadAuto() {
    this.checkConnetion((status) => {
      try {
        if (!this.loadFirstTime) {
          if (!this.loading && this.isConnected) {
            this.localService.getData((data: StaticData) => {
              this.enableFilterButton = true;
              this.loadFirstTime = true;
            });
            this.loadAds();
            this.loadBanner();
          }
        }
      } catch (err) {
      }
    });
  }

  loadData(event) {
    this.lastEvent = event;
    if (!this.loading) {
      setTimeout(() => {
        if (this.tab === this.RECENTS_TAB) {
          this.recentsPage++;
          console.log(this.recentsPage);
          this.loadRecents((isEnd) => {
            event.target.complete();
            event.target.disabled = isEnd;
          });
        } else {
          this.mostSeenPage++;
          this.loadMostSeen((isEnd) => {
            event.target.complete();
            event.target.disabled = isEnd;
          });
        }

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (_.size(this.recents) > 500 || _.size(this.mostSeen) > 500) {
          event.target.disabled = true;
        }
      }, 500);
    }
  }

  checkConnetion(callback = (status) => { }) {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (this.isInPause === false) {
        callback(this.isConnected);
      }
    });
  }

  async loadBanner() {
    this.loadingBannerTop = true;
    this.loadingBannerBottom = true;
    if (this.isConnected) {
      this.servAnuncio.getBannerSuperior().then(data => {
        this.bannersTop = data as Banner[];
        setTimeout(() => {
          this.loadingBannerTop = false;
        }, 2000);
      }).catch(() => {
        this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
      });
      this.servAnuncio.getBannerInferior().then(data => {
        this.bannersBottom = data as Banner[];
        setTimeout(() => {
          this.loadingBannerBottom = false;
        }, 2000);
      }).catch(() => {
        this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
      });
    }
  }

  async loadAds() {
    this.loading = true;
    if (this.tab === this.RECENTS_TAB) {
      this.loadRecents(() => {
      });
    } else {
      this.loadMostSeen(() => {
      });
    }
  }

  loadRecents(callback = (isEnd) => { }) {
    if (_.size(this.recents) === 0) {
      this.loading = true;
    }
    try {
      if (this.isConnected) {
        if (_.size(_.keys(this.filters))) {
          this.servAnuncio.buscarAnunciosAvanzados(this.filters, this.recentsPage, this.pagination).then(res => {
            if (_.size(res) > 0) {
              this.recents = _.concat(this.recents || [], res);
              console.log(this.recents);
              for (const i of (this.recents as AnunciosModel[])) {
                if (i.ImageContent !== undefined && i.ImageContent !== null) {
                  i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
                } else {
                  i.Imagen = i.Categoria.ImageName;
                }
              }
            }
            this.loading = false;
            callback(_.size(res) === 0);
          }).catch(() => {
            this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
            setTimeout(() => {
              this.loading = false;
            }, 2000);
            callback(false);
          });
        } else {
          this.servAnuncio.getAnunciosRecientes('', this.searchText, 'asc', this.recentsPage, this.pagination).then(data => {
            if (_.size(data) > 0) {
              this.recents = _.concat(this.recents || [], data);
              console.log(this.recents);
              for (const i of (this.recents as AnunciosModel[])) {
                if (i.ImageContent !== undefined && i.ImageContent !== null) {
                  i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
                } else {
                  i.Imagen = i.Categoria.ImageName;
                }
              }
            }
            this.loading = false;
            callback(_.size(data) === 0);
          }).catch(() => {
            this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
            setTimeout(() => {
              this.loading = false;
            }, 2000);
            callback(false);
          });
        }
      }
    } catch (err) {
    }

  }

  loadMostSeen(callback = (isEnd) => { }) {
    if (_.size(this.mostSeen) === 0) {
      this.loading = true;
    }
    if (this.isConnected) {
      if (_.size(_.keys(this.filters))) {
        this.servAnuncio.buscarAnunciosAvanzados(this.filters, this.mostSeenPage, this.pagination).then(res => {
          if (_.size(res) > 0) {
            this.mostSeen = _.concat(this.mostSeen || [], res);
            for (const i of (this.mostSeen as AnunciosModel[])) {
              if (i.ImageContent !== undefined && i.ImageContent !== null) {
                i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              } else {
                i.Imagen = i.Categoria.ImageName;
              }
            }
          }
          this.loading = false;
          callback(_.size(res) > 0);
        }).catch(() => {
          this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          callback(false);
        });
      } else {
        this.servAnuncio.getAnunciosPopulares('', this.searchText, 'asc', this.mostSeenPage, this.pagination).then(data => {
          if (_.size(data) > 0) {
            this.mostSeen = _.concat(this.mostSeen || [], data);
            for (const i of (this.mostSeen as AnunciosModel[])) {
              if (i.ImageContent !== undefined && i.ImageContent !== null) {
                i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              } else {
                i.Imagen = i.Categoria.ImageName;
              }
            }
          }
          this.loading = false;
          callback(_.size(data) === 0);
        }).catch(() => {
          this.presentToast('Por favor verifique su conexión a internet y vuelva a intentarlo.');
          this.loading = false;
          callback(false);
        });

      }
    }
  }

  async details(ad: AnunciosModel) {
    this.navCtrl.navigateForward('/details', { state: { ad } });
  }

  sendShare(titulo?, id?) {
    const url = 'https://setvmas.com/#/detalles-anuncio/' + id;
    this.socialSharing.share(titulo, titulo, null, url);
  }

  openWeb(url) {
    const browser = this.iab.create(url, '_system');
    browser.show();
  }

  open(ad: AnunciosModel) {
    if (ad.Url) {
      this.openWeb(ad.Url);
    } else {
      this.details(ad);
    }
  }

  openBanner(banner: Banner) {
    if (banner.Url) {
      this.openWeb(banner.Url);
    } else {
      this.servAnuncio.getAnunciosById(banner.AnuncioId).then(ad => this.details(ad));
    }
  }

  getIndexesForSlidesBottom() {
    const index = parseInt((this.bannersBottom.length / 4).toFixed(), 0) +
      (this.bannersBottom.length % 4 > 0 ? 1 : 0);
    const indexes = [];
    for (let i = 0; i < index; i++) {
      indexes.push(i * 4);
    }
    return indexes;
  }

  getImagesForSlideBottom(index) {
    const images = [];
    for (let i = 0; i < 4; i++) {
      if (index + i > _.size(this.bannersBottom) - 1) {
        const pos = (_.size(this.bannersBottom) - index - i);
        images.push(this.bannersBottom[pos < 0 ? pos * -1 : pos]);
      } else {
        images.push(this.bannersBottom[index + i]);
      }
    }
    return images;
  }

  onReload() {
    this.content.scrollToTop();
    if (this.lastEvent) {
      this.lastEvent.target.complete();
      this.lastEvent = null;
    }
    this.onSearch();
  }

  onSearch(restartContent = false) {
    if (restartContent) {
      const c: any = document.getElementById('pageContent');
      if (c) {
        c.scrollToTop();
      }
      this.infiniteScroll.disabled = false;
    }
    this.recents = [];
    this.mostSeen = [];
    this.recentsPage = 1;
    this.mostSeenPage = 1;
    localStorage.setItem('SETVMAS_SEARCH_TEXT', this.searchText);
    this.loadAds();
  }

  onSearchClear() {
    this.searchText = '';
    localStorage.setItem('SETVMAS_SEARCH_TEXT', this.searchText);
    const c: any = document.getElementById('pageContent');
    if (c) {
      c.scrollToTop();
    }
    this.infiniteScroll.disabled = false;

    setTimeout(() => {
      const co: any = document.getElementById('pageContent');
      if (co) {
        co.scrollToTop();
      }
      this.infiniteScroll.disabled = false;
    }, 100);
    this.onSearch();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 8000
    });
    return await toast.present();
  }

  toggleConection() {
    // tslint:disable-next-line: deprecation
    document.getElementById('enable').style.webkitAnimation = 'pulse linear .60s';
    document.getElementById('enable').style.animation = 'pulse linear .60s';

    if (this.isConnected === false) {
      this.WifiWizard2.enableWifi();
      this.checkConnetion();
    } else if (this.isConnected === true) {
      this.isConnected = false;
      this.WifiWizard2.disableWifi();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Salir de la Aplicación',
      message: '<strong>¿Seguro que desea salir de su usuario en Setvmas?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Salir',
          handler: async () => {
            this.servAnuncio.logout();
          }
        }
      ]
    });

    await alert.present();
  }
}
