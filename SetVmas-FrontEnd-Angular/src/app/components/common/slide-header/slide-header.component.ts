import { Component, OnInit } from '@angular/core';
import { ItemSlide } from '../../../models/itemSlide.model';
import { TipoOpcionService } from '../../../services/type-option/tipo-opcion.service';
import { AnunciosService } from '../../../services/advert/anuncios.service';
import { Opciones } from '../../../models/opciones.model';
import { map } from 'rxjs/operators';
import { Banner } from '../../../models/banner.model';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';


@Component({
  selector: 'app-slide-header',
  templateUrl: './slide-header.component.html',
  styleUrls: ['./slide-header.component.css']
})

export class BannerHeaderComponent implements OnInit {
  currentImageIndex = 0;
  bannersDesktop: Banner[] = [];
  bannersMobil: Banner[] = [];
  slides: ItemSlide[] = [];
  slideConfig = {};
  isLoadComplete = false;
  readonly rootURL = this.servConfiguracion.getSiteUrl();
  readonly rootSiteURL = this.servConfiguracion.getUrlRootSite();

  urlDesktop = this.rootURL + 'anuncios/';
  urlMovil = this.rootURL + 'anuncios/mini/';

  constructor(private serviceA: AnunciosService, private servConfiguracion: ConfiguracionesService,
              private domSanitizer: DomSanitizer) {

    Promise.all([
      this.serviceA.getBanners('Superior escritorio').then(res => {
        this.bannersDesktop = res as Banner[];
      }),

      this.serviceA.getBanners('Superior movil').then(res => {
        this.bannersMobil = res as Banner[];
      })
    ]).then(success => {
      this.isLoadComplete = true;
    });
  }

  getStyle(imageName: string) {
    const url = this.rootURL + imageName;
    // console.log(url);
    // const urlSave = this.domSanitizer.bypassSecurityTrustUrl(url);
    // console.log(urlSave);
    const urlStyle = this.domSanitizer.bypassSecurityTrustStyle('url(' + url + ')');
    return urlStyle;
  }

  // buildSlides(bannersDesktop: Banner[], bannersMobil: Banner[]) {
  //   bannersDesktop.forEach((value, index) => {
  //     const itemSlide: ItemSlide = {
  //       link: value.Url,
  //       urlImageWeb: value.ImageName,
  //       urlImageResponsive: bannersMobil[index].ImageName
  //     };
  //     this.slides.push(itemSlide);
  //   });
  // }

  // slides: ItemSlide[] = [
  //   {
  //     link: 'https://setvmas.com/angular',
  //     urlImageWeb: 'assets/images/slide/5.jpg',
  //     urlImageResponsive: 'assets/images/slide/headerR-1.jpg'
  //   },
  //   {
  //     link: 'https://setvmas.com/angular',
  //     urlImageWeb: 'assets/images/slide/6.jpg',
  //     urlImageResponsive: 'assets/images/slide/headerR-1.jpg'
  //   }
  // ];

  ngOnInit(): void {

    let data = {indexSlide: 0};

    if (localStorage.getItem('currentImageIndex') != null) {
      data = JSON.parse(localStorage.getItem('currentImageIndex'));
      data.indexSlide = parseInt(data.indexSlide.toString()) + 1;

      if (data.indexSlide >= this.slides.length) {
        data.indexSlide = 0;
      }
      this.currentImageIndex = data.indexSlide;
      localStorage.setItem('currentImageIndex', JSON.stringify(data));
    } else {
      this.currentImageIndex = data.indexSlide;
      localStorage.setItem('currentImageIndex', JSON.stringify(data));
    }

    this.slideConfig = {
      'slidesToShow': 1,
      'slidesToScroll': 1,
      'initialSlide' : this.currentImageIndex,
      'dots': false,
      'infinite': true,
      'autoplay': true,
      'autoplaySpeed': 8000
    };


    // this.buildSlides(this.bannersDesktop, this.bannersMobil);
  }
}
