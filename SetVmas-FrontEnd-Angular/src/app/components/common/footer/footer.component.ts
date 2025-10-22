import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router,public configservice: ConfiguracionesService) { }

  ngOnInit(): void {

  }

  hideFooter(){
    this.visibility('#footer', false) ;
  }

  showFooter(){
    this.visibility('#footer', true) ;
  }

 /*loadPage(){
   this.router.navigate(['/pagina/2']);
 }*/
  visibility(selector, visible) {
    var elemento = document.querySelector(selector);
    console.log(elemento);
    if (elemento != null) {
      elemento.style.display = visible?'block':'none';
    }
  }

}
