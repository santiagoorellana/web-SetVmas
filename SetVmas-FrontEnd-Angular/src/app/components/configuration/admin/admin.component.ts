import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import {UsuarioService} from '../../../services/user/usuario.service';
import {StatisticsService} from '../../../services/statictics/statistics.service';
import {Usuario} from '../../../models/usuario.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  currentUser: Usuario;
  cantUsuario = 0;
  cantAnuncio = 0;
  cantPuntos = 0;
  cantBs = 0;
  cantBi = 0;
  cantULM = 0;
  cantView = 0;
  cantAuto = 0;
  cantBa = 0;
  cantVentaUs = 0;
  cantDenPen = 0;
  cantComConf = 0;
  cantAnunInv = 0;
  cantRefWeb = 0;

  constructor( public authenticationService: AuthenticationService, public service: UsuarioService,
               private servHome: StatisticsService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    // this.fecha = this.currentUser.FechaCreacion.toString("dd-MM-yyyy");
  }

  salvarCambios() {
    this.service.formData = this.currentUser;
    this.service.putUsuarioSinListar();
  }

  ngOnInit(): void {

    this.servHome.getCantidadAnuncios().then(res => this.cantAnuncio = res as number);
    this.servHome.getPuntos().then(res => this.cantPuntos = res as number);
    this.servHome.getCantidadBannerSuperior().then(res => this.cantBs = res as number);
    this.servHome.getCantidadBannerInferior().then(res => this.cantBi = res as number);
    this.servHome.getCantidadBannerActivo().then(res => this.cantBa = res as number);
    this.servHome.getCantidadUserLastMes().then(res => this.cantULM = res as number);
    this.servHome.getCantidadAnunciosInvitado().then(res => this.cantAnunInv = res as number);
    this.servHome.getUsuarioCount().then(res => this.cantUsuario = res as number);
    this.servHome.getCantidadView().then(res => this.cantView = res as number);
    this.servHome.getCantidadAutorrenovable().then(res => this.cantAuto = res as number);
    this.servHome.getCantidadVentasUsuario().then(res => this.cantVentaUs = res as number);
    this.servHome.getCantidadDenunciasPendiente().then(res => this.cantDenPen = res as number);
    this.servHome.getCantidadComprasConfirmar().then(res => this.cantComConf = res as number);
    this.servHome.getCantidadWeb().then(res => this.cantRefWeb = res as number);
  }

}
