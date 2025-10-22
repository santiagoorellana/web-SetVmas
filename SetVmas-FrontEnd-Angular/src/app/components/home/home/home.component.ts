import {Component, ElementRef, OnInit} from '@angular/core';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import {Router} from '@angular/router';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  router: string;
  constructor(private loading: LoadingIndicatorService,private _router: Router,
              public titleService: Title,public metaService: Meta) {
    _router.events.subscribe((val) => {
      this.router = this._router.url;
    });
  }

  ngOnInit(): void {
   // localStorage.removeItem("referido");
   localStorage.setItem("muestramenu","m");
    this.metaService.removeTag("name='description'");
    this.metaService.removeTag("name='keywords'");
    this.titleService.setTitle('Buscar anuncios en Setvmás');
    this.metaService.addTag( { name: 'author', content:'Setvmás' });
    this.metaService.addTag( { name: 'description', content: 'Red de publicidad en Cuba para comprar, vender, cambiar y ofrecer servicios y productos. Donde ganas puntos por entrar, ver, anunciar, referir y ayudar' });
    this.metaService.addTag( { name: 'keywords', content: 'Red, publicidad, anuncios, clasificados, comprar, vender, cambiar, servicios, productos, cuba, setvmas'});


  }
}
