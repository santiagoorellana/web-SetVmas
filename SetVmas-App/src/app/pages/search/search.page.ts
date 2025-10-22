import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { Etiqueta } from '../../models/etiqueta.model';
import { BuscarAnunciosModel } from '../../models/buscar-anuncios.model';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { SettingsService } from '../../services/settings.service';
import * as _ from 'lodash';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LocalDataService, StaticData } from '../../services/local-data.service';
import { MunicipiosModel } from '../../models/municipios.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, AfterViewInit {

  filters: BuscarAnunciosModel = {};
  localities = [];
  categories: Array<Categoria> = [];
  tags: Array<Etiqueta>;
  actions: Array<string>;
  loading: HTMLIonLoadingElement;
  category: Categoria;
  locality: MunicipiosModel;

  @ViewChild('categorySelect', { static: false }) categorySelect: IonicSelectableComponent;
  @ViewChild('municipioSelect', { static: false }) municipioSelect: IonicSelectableComponent;

  constructor(
    public service: AnuncioService,
    private servCo: SettingsService,
    public navCtrl: NavController,
    public platform: Platform,
    private localService: LocalDataService,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.service.filters.subscribe(filters => {
      this.filters = filters || {};
    });
  }

  ngAfterViewInit() {
    _.each(this.servCo.getProviciasAll(), (prov) => {
      _.each(prov.Municipios, (municipio) => {
        municipio.provincia = prov;
        this.localities.push(municipio);
      });
    });
    this.localService.getData((data: StaticData) => {
      this.categories = data.categories;
    });
    this.actions = this.servCo.getAccionesAnuncio();
  }

  ionViewWillEnter() {
    if (this.filters.Municipio) {
      this.locality = _.find(this.localities, { Nombre: this.filters.Municipio });
    }
    if (this.filters.Categoria) {
      this.presentLoading(() => {
        this.category = _.find(this.categories, { Nombre: this.filters.Categoria });
        this.localService.getEtiquetasByCategoria(this.category.CategoriaId).then((tags) => {
          this.tags = tags;
          this.loading.dismiss();
        }).catch(err => this.loading.dismiss());
      });
    }
  }

  municipioChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if (event.value) {
      this.filters.Municipio = event.value.Nombre;
      // this.filters.Provincia = event.value.provincia.Nombre;
    }
  }

  categoryChange(event: {
    component: IonicSelectableComponent,
    value: Categoria
  }) {
    this.filters.Categoria = event.value.Nombre;
    this.presentLoading(() => {
      this.localService.getEtiquetasByCategoria(event.value.CategoriaId).then((tags) => {
        this.tags = tags;
        this.filters.ListaEtiquetas = [];
        this.loading.dismiss();
      }).catch(err => this.loading.dismiss());
    });
  }

  async presentLoading(callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere...'
    });
    await this.loading.present();
    callback();
  }

  clear() {
    this.filters = {};
    this.municipioSelect.clear();
    this.categorySelect.clear();
    this.tags = [];
    this.service.filters.next(this.filters);
    this.service.resetScroll = true;
  }
  save() {
    if (_.size(this.filters.ListaEtiquetas) === 0) {
      this.service.filters.next(_.omit(this.filters, ['ListaEtiquetas']));
    } else {
      this.service.filters.next(this.filters);
    }
    this.service.resetScroll = true;
    this.navCtrl.navigateForward('/home');
  }
}
