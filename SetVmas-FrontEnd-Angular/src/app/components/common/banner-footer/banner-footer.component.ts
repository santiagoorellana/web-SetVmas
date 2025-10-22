import { Component, OnInit } from '@angular/core';
import { ItemSlideFooter } from '../../../models/itemSlide.model';
import { Banner } from '../../../models/banner.model';
import { AnunciosService } from '../../../services/advert/anuncios.service';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'banner-footer',
  templateUrl: './banner-footer.component.html',
  styleUrls: ['./banner-footer.component.css']
})

export class BannerFooterComponent implements OnInit {

  banners: Banner[] = [];
  readonly rootURL = this.servConfiguracion.getSiteUrl();
  readonly rootSiteURL = this.servConfiguracion.getUrlRootSite();
  cont=0;

  slides: ItemSlideFooter[] = [
    {
      link:"https://setvmas.com/angular",
      urlImageFooter:'assets/images/slide/1.jpg',
      title: "Anuncio 1",
      category:"Categoria 1"
    },
    {
      link:"https://setvmas.com/angular",
      urlImageFooter:"assets/images/slide/2.jpg",
      title: "Anuncio 2",
      category:"Categoria 2"
    },
    {
      link:"https://setvmas.com/angular",
      urlImageFooter:"assets/images/slide/3.jpg",
      title: "Anuncio 3",
      category:"Categoria 3"
    },
    {
      link:"https://setvmas.com/angular",
      urlImageFooter:"assets/images/slide/4.jpg",
      title: "Anuncio 4",
      category:"Categoria 4"
    },
    {
      link:"https://setvmas.com/angular",
      urlImageFooter:"assets/images/slide/2.jpg",
      title: "Anuncio 5",
      category:"Categoria 5"
    },
    {
      link:"https://setvmas.com/angular",
      urlImageFooter:"assets/images/slide/3.jpg",
      title: "Anuncio 6",
      category:"Categoria 6"
    },
    {
      link:"https://setvmas.com/angular",
      urlImageFooter:"assets/images/slide/4.jpg",
      title: "Anuncio 7",
      category:"Categoria 7"
    },
    {
      link:"https://setvmas.com/angular",
      urlImageFooter:"assets/images/slide/2.jpg",
      title: "Anuncio 8",
      category:"Categoria 8"
    }
  ];

  slideConfig = {
    'slidesToShow': 4,
    'slidesToScroll': 1,
    'dots': false,
    'infinite': true,
     'autoplay': true,
     'autoplaySpeed': 8000
  };

  slideConfigResponsive = {
    'slidesToShow': 1,
    'slidesToScroll': 1,
    'dots': false,
    'infinite': true,
     'autoplay': true,
     'autoplaySpeed': 8000
  };
  constructor(private serviceA: AnunciosService, private servConfiguracion: ConfiguracionesService,
              private domSanitizer: DomSanitizer) {


  }

  getStyle(imageName: string) {
    if(imageName !== "" && imageName !== undefined && imageName !== null){
      const url = this.rootURL + "banners/inferior/" + imageName;
      const urlStyle = this.domSanitizer.bypassSecurityTrustStyle('url(' + url + ')');
      return urlStyle;
    }
    const url = this.rootURL + "uploads/categorias/1.jpg";
    const urlStyle = this.domSanitizer.bypassSecurityTrustStyle('url(' + url + ')');
    return urlStyle;
  }

  ngOnInit(): void {
    // Zuleidy lista de Banners Inferiores
    this.serviceA.getBanners('Inferior').then(res => {
      this.banners = res as Banner[];
    });

  }

  getStr(anuncio: string) {
   var str=anuncio.slice(0, 30);
       return str;
  }
  afterChange(e)
  {
    this.cont++;
    if(this.cont==this.banners.length)
    {
      this.serviceA.getBanners('Inferior').then(res => {
        this.banners = res as Banner[];
        this.cont=0;
      });
    }


  }





}
