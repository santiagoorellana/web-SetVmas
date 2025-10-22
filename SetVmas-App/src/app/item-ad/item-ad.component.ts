import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import * as _ from 'lodash';
import { AnunciosModel } from '../models/anuncios.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-item-ad',
  templateUrl: './item-ad.component.html',
  styleUrls: ['./item-ad.component.scss'],
})
export class ItemAdComponent implements OnInit {
  _ = _;
  rootURL = environment.rootURLImages;
  @Input() item: AnunciosModel;
  words: string;
  constructor(
    private iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    if(this.item)
    this.getWords(this.item);
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
    const option = _.find(ad.OpcionesAvanzadas, {NombreCodigo: 'MI_WEB'});
    if (ad.Url && option && option.IsActivo) {
      this.openWeb(ad.Url);
    } else {
      this.details(ad);
    }
  }

  getWords(ad: AnunciosModel) {
    const words = _.map(ad.Etiquetas, 'Nombre');
    this.words = words.join(', ');
  }
}
