import { Component, OnInit, Inject } from '@angular/core';
import { ModalLoginComponent } from '../modals/home/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import {Usuario} from '../../../models/usuario.model';
import {HeaderService} from '../../../services/header/header.service';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import {Router} from '@angular/router';
import { ModalRegisterComponent } from '../modals/home/register/register.component';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import { VariableConfiguracionService } from '../../../services/variable/variable-configuracion.service';
import {VariableConfiguracion} from '../../../models/variable-configuracion.model';
import {ToastrService} from 'ngx-toastr';
import { EditarAnunciosComponent } from '../modals/advert/editar-anuncios/editar-anuncios.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isExpanded = false;
  currentUser: Usuario; // login
  list: string[];
  usuario: string;
  anf:string;
  router: string;
  subMenuActive  = false;
  linkApp:string='';
  mostrarBloqueado = false;
  cantAnunciar:boolean=true;


  constructor(public dialog: MatDialog, public servHeader: HeaderService, public authenticationService: AuthenticationService,
              @Inject(DOCUMENT) private document: Document, private _router: Router, private serviceVC:VariableConfiguracionService,
              public toastr: ToastrService, private overlay: Overlay) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.list = ['vacio'];
      if (this.currentUser != null) {
        this.list = this.currentUser.Correo.split('@');
        this.mostrarBloqueado = this.currentUser.Bloqueado;
      }
    });

    this.serviceVC.getVariableConfiguracionByCodigo('Url_App').then(res => this.linkApp=(res as VariableConfiguracion).Valor);


    this._router.events.subscribe((val) => {
      this.router = this._router.url;
      this.subMenuActive = this.router.includes('nomencladores');
    });

  }

  ngOnInit(): void {



    this.servHeader.esconderMenu.subscribe(res => { this.isExpanded = res as boolean; });
    if (this.currentUser != null) {
      this.list = this.currentUser.Correo.split('@');

      this.serviceVC.getVariableConfiguracionByCodigo("Invitado_Anunciar")
      .then(res => {
        if((res as VariableConfiguracion).Valor=='true')
        this.cantAnunciar=true;
        else
        this.cantAnunciar=false;
      });
    }
  }




  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
  openNav() {
    document.getElementById('mySidenav').style.width = '280px';
    document.getElementById('overlay').style.width = '100%';
    // document.getElementById('main').style.marginLeft = '250px';
    document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('overlay').style.width = '0';
    // document.getElementById('main').style.marginLeft = '0';
    document.body.style.backgroundColor = 'white';
  }

  // MODALS
  openDialogLogin(): void {
    const dialogRef = this.dialog.open(ModalLoginComponent, {
      width: '360px',
      height: 'auto',
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
      if (this.currentUser != null) {
        this.list = this.currentUser.Correo.split('@');
      }
    });
    this.closeNav();
  }

  openDialogRegister(): void {
    const dialogRef = this.dialog.open(ModalRegisterComponent, {
      width: '800px',
      height: 'auto',
    });
    localStorage.removeItem("reautenticate");
    localStorage.setItem("reautenticate","0");
    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
    });
    this.closeNav();
  }

  logout() {
    this.authenticationService.logout();
    this._router.navigate(['/']);
    localStorage.removeItem("idAnfitrion");
    this.mostrarBloqueado = false;
  }

  mostrarBtnMenu () {
    // console.log('user'+JSON.stringify(this.currentUser))
    if (this.currentUser) {
      return true;
    }
    return false;
  }



  isActive(value){
    let clase = '';
    switch (value) {
      case 'inicio':
        if(this.router == clase)
          clase = 'active';
        break;
    }
    return clase;
  }

  showMenu(){

    this.visibility('#menu', true) ;

  }

  hideMenu(){

    this.visibility('#menu', false) ;

  }


  visibility(selector, visible) {
    var elemento = document.querySelector(selector);
    console.log(elemento);
    if (elemento != null) {
      elemento.style.display = visible?'block':'none';
    }
  }

   // Open Modal Insert Anuncio
   openDialogAnunciar(): void {



    if(this.cantAnunciar==true || (this.currentUser != null && !this.currentUser.Bloqueado))
  {
    const dialogRef = this.dialog.open(EditarAnunciosComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '100% !important',
      panelClass: 'full-screen-modal',
      scrollStrategy: this.overlay.scrollStrategies.close(),
      data: { anuncio: null}
    });
      this.document.body.classList.add('noscroll');
  
      dialogRef.afterClosed().subscribe(result => {
        this.document.body.classList.remove('noscroll');
        // this.animal = result;
      });
  
  
  
  }
  else
  this.toastr.error('Ud no puede anunciar en estos momentos.');
  
    }


}
