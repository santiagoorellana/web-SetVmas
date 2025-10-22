import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ConfiguracionesService} from '../configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient,
              private servConfiguracion: ConfiguracionesService,
              private router: Router
  ) { }

  getCantidadAnuncios() {
    return this.http.get(this.rootURL + 'Usuarios/AnunciosCount' ).toPromise();
  }

  getPuntos() {
    return this.http.get(this.rootURL + 'Usuarios/Puntos' ).toPromise();
  }
  getCantidadBannerSuperior() {
    return this.http.get(this.rootURL + 'Usuarios/BannerSuperior' ).toPromise();
  }
  getCantidadBannerInferior() {
    return this.http.get(this.rootURL + 'Usuarios/BannerInferior' ).toPromise();
  }
  getCantidadBannerActivo() {
    return this.http.get(this.rootURL + 'Usuarios/BannerActivo' ).toPromise();
  }
  getCantidadUserLastMes() {
    return this.http.get(this.rootURL + 'Usuarios/LastMes' ).toPromise();
  }

  getUsuarioCount() {
    return this.http.get(this.rootURL + 'Usuarios/Count').toPromise();
  }
  getCantidadView() {
    return this.http.get(this.rootURL + 'Usuarios/View' ).toPromise();
  }
  getCantidadAutorrenovable() {
    return this.http.get(this.rootURL + 'Usuarios/Auto' ).toPromise();
  }
  getCantidadVentasUsuario() {
    return this.http.get(this.rootURL + 'Usuarios/VentasUsuario' ).toPromise();
  }
  getCantidadDenunciasPendiente() {
    return this.http.get(this.rootURL + 'Usuarios/DenunciasPendiente' ).toPromise();
  }
  getCantidadComprasConfirmar() {
    return this.http.get(this.rootURL + 'Usuarios/ComprasConfirmar' ).toPromise();
  }
  getCantidadWeb() {
    return this.http.get(this.rootURL + 'Usuarios/Web' ).toPromise();
  }
  getCantidadAnunciosInvitado() {
    return this.http.get(this.rootURL + 'Usuarios/AnunciosInvitado' ).toPromise();
  }

}
