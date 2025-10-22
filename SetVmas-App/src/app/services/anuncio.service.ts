import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Etiqueta } from '../models/etiqueta.model';
import { AnunciosModel } from '../models/anuncios.model';
import { Usuario } from '../models/usuario.model';
import { Categoria } from '../models/categoria.model';
import { PointSell } from '../models/sell-points.model';
import { Purchase } from '../models/purchase.model';
import { BuscarAnunciosModel } from '../models/buscar-anuncios.model';
import * as _ from 'lodash';
import { Denuncia } from '../models/denuncia.model';
import { environment } from '../../environments/environment';
import { VariableConfiguracion } from '../models/variable-configuracion.model';
import { TipoOpcionModel } from '../models/tipo-opcion.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  CURRENT_USER = 'CURRENT_USER_SETVMAS';
  CURRENT_PASS = 'CURRENT_PASS_SETVMAS';
  CURRENT_FILTERS = 'CURRENT_FILTERS_SETVMAS';
  anuncio: any;
  pointSell: PointSell;
  purchaseData: Purchase;
  filters: BehaviorSubject<BuscarAnunciosModel> = new BehaviorSubject<BuscarAnunciosModel>({});
  public guest: Usuario;
  public currentUser: BehaviorSubject<Usuario> = new BehaviorSubject<Usuario>(null);
  // public currentUser: Usuario;
  public nameUser: any;
  private user;

  public resetScroll = false;

  readonly rootURL;
  constructor(private http: HttpClient, private servConfiguracion: SettingsService) {
    this.rootURL = environment.rootURL;
    this.currentUser.subscribe((currentUser) => {
      this.user = currentUser;
      if (currentUser) {
        const index = currentUser.Correo.indexOf('@');
        if (index !== -1) {
          this.nameUser = currentUser.Correo.substr(0, index);
        }
      } else {
        this.nameUser = null;
      }
    });
    if (localStorage.getItem(this.CURRENT_FILTERS)) {
      this.filters.next(JSON.parse(localStorage.getItem(this.CURRENT_FILTERS)));
    }
    this.filters.subscribe(filters => {
      localStorage.setItem(this.CURRENT_FILTERS, JSON.stringify(filters));
    });
  }

  /*********Api Request******** */

  getAnuncios(col, filter, sortDirection, pageIndex, pageSize) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios', {
        params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  getAnunciosByUser(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get<Array<AnunciosModel>>(this.rootURL + 'Anuncios/Usuarios', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();
  }

  ocultarMostrarAnuncio(id) {
    return this.http.get(this.rootURL + 'Anuncios/Ocultar/' + id).toPromise();
  }

  getAnunciosById(id) {
    return this.http.get<AnunciosModel>(this.rootURL + 'Anuncios/' + id).toPromise();
  }

  getAnunciosRecientes(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Anuncios/Recientes', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();
  }

  getAnunciosPopulares(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Anuncios/Populares', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();
  }

  reportAd(denuncia: Denuncia) {
    return this.http.post(this.rootURL + 'Denuncias', denuncia).toPromise();
  }

  addView(id: number) {
    return this.http.get(this.rootURL + 'Anuncios/AnuncioVisto/' + id).toPromise();
  }

  buscarAnunciosAvanzados(buscar: BuscarAnunciosModel, indexPage = 1, sizePage = 8) {
    const filters: BuscarAnunciosModel = _.merge(_.clone(buscar), { sizePage, indexPage, ListaEtiquetas: [] });
    return this.http.post(this.rootURL + 'Anuncios/Avanzados', filters).toPromise();
  }

  buscarAnunciosAvanzadosCount(buscar: BuscarAnunciosModel) {
    return new Promise(resolve => {
      this.http.post(this.rootURL + 'Anuncios/AvanzadosCount', buscar).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });


  }

  insertarAnuncio(data) {
    return this.http.post(this.rootURL + 'Anuncios', data).toPromise();
  }

  updateAnuncio(anuncioId, data) {
    return this.http.put(this.rootURL + 'Anuncios/' + anuncioId, data).toPromise();
  }

  deleteAnuncio(id) {
    return this.http.delete(this.rootURL + 'Anuncios/' + id).toPromise();
  }

  getBannerSuperior() {
    return this.http.get(this.rootURL + 'Banners/Tipo/Superior escritorio').toPromise();
  }

  getBannerInferior() {
    return this.http.get(this.rootURL + 'Banners/Tipo/Inferior').toPromise();
  }

  enviarCorreo(nombre, correo, asunto, mensaje, captcha) {
    return this.http.get(this.rootURL + 'PaginasEstaticas/Correo', {
      params: new HttpParams()
        .set('nombre', nombre.toString())
        .set('correo', correo.toString())
        .set('asunto', asunto.toString())
        .set('mensaje', mensaje.toString())
        .set('captcha', captcha.toString())
    }).toPromise();
  }

  getPaginasEstaticasByid(id) {
    return this.http.get(this.rootURL + 'PaginasEstaticas/' + id).toPromise();
  }

  getconfiguration(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get<VariableConfiguracion[]>(this.rootURL + 'VariableConfiguracions', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();

  }

  getVariableConfiguracionByCodigo(codigo) {
    return this.http.get<VariableConfiguracion>(this.rootURL + 'VariableConfiguracions/Codigo', {
      params: new HttpParams().set('codigo', codigo)
    }).toPromise();
  }

  getUsuarioByid(id) {
    return this.http.get(this.rootURL + 'Usuarios/' + id).toPromise();
  }

  getUsuarioVolumenCompraByUser(id) {
    return this.http.get<number>(this.rootURL + 'Usuarios/VolumenCompras/' + id).toPromise();
  }

  login(Correo: string, Password: string) {
    return new Promise((resolve, reject) => {
      this.http.post(this.rootURL + 'Usuarios/SingIn', { username: Correo, password: Password })
        .subscribe(res => {
          localStorage.setItem('token', JSON.parse(JSON.stringify(res)).token);
          localStorage.setItem(this.CURRENT_PASS, Password);
          this.getCurrentUser().then(resolve).catch(reject);
        }, reject);
    });
  }

  relogin() {
    return new Promise((resolve, reject) => {
      if (_.get(this.user, 'Correo') && localStorage.getItem(this.CURRENT_PASS)) {
        this.http.post(this.rootURL + 'Usuarios/SingIn',
          { username: _.get(this.user, 'Correo'), password: localStorage.getItem(this.CURRENT_PASS) })
          .subscribe(res => {
            localStorage.setItem('token', JSON.parse(JSON.stringify(res)).token);
            this.getCurrentUser().then(resolve).catch(reject);
          }, reject);
      } else {
        resolve(null);
      }
    });
  }

  getUsuarioById(id) {
    return this.http.get<Usuario>(this.rootURL + 'Usuarios/' + id).toPromise();
  }

  getLocalCurrentUser() {
    const user = JSON.parse(localStorage.getItem(this.CURRENT_USER));
    if (user) {
      this.setUser(user);
    }
    return user;
  }

  getCurrentUser() {
    return new Promise<Usuario>((resolve, reject) => {
      if (this.getLocalCurrentUser()) {
        resolve(this.getLocalCurrentUser());
        return;
      }
      this.http.get<Usuario>(this.rootURL + 'Usuarios/Current')
        .subscribe(res => {
          localStorage.setItem(this.CURRENT_USER, JSON.stringify(res));
          this.setUser(res);
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  setUser(user: Usuario) {
    this.currentUser.next(user);
  }

  refreshCurrentUser(successCallback, errorCallback) {
    this.http.get<Usuario>(this.rootURL + 'Usuarios/Current')
      .subscribe(res => {
        localStorage.setItem(this.CURRENT_USER, JSON.stringify(res));
        this.setUser(res);
        successCallback(res);
      }, (err) => {
        errorCallback(err);
      });
  }

  logout() {
    localStorage.clear();
    this.currentUser.next(null);
    this.nameUser = null;
  }

  getUsuarioByCorreo(correo) {
    return this.http.get<Usuario>(this.rootURL + 'Usuarios/Correo/' + correo).toPromise();
  }

  async getGuest() {
    if (!this.guest) {
      this.guest = await this.http.get<Usuario>(this.rootURL + 'Usuarios/Correo/' + environment.guest).toPromise();
    }
    return this.guest;
  }

  register(Correo: string, Password: string, Anfitrion: string, Telefono: string, Captcha: string) {
    return this.http.post(this.rootURL + 'Usuarios', { Correo, Password, Anfitrion, Telefono, Captcha }).toPromise();
  }

  confirmar(codigo: string) {
    return this.http.get<Usuario>(this.rootURL + 'Usuarios/Confirmar/' + codigo).toPromise();
  }

  getUsuarioCodigo(codigo) {
    return this.http.get(this.rootURL + 'Usuarios/Codigo', {
      params: new HttpParams()
        .set('codigo', codigo)

    }).toPromise();
  }

  recuperar(correo) {
    return this.http.get(this.rootURL + 'Usuarios/Recuperar/', {
      params: new HttpParams()
        .set('correo', correo)
    }).toPromise();
  }

  getTipoOpcions(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get<Array<TipoOpcionModel>>(this.rootURL + 'TipoOpcions', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();
  }

  getEtiquetasAll(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get<Array<Etiqueta>>(this.rootURL + 'Etiquetas', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();
  }

  getAnunciosCountV2(col, filter, sortDirection, pageIndex, pageSize, metodo) {
    return this.http.get(this.rootURL + 'Anuncios/CountHome', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('metodo', metodo.toString())
    }).toPromise();
  }

  getPurchaseViewData() {
    return this.http.get(this.rootURL + 'pagoes/compra').toPromise();
  }

  buyPoint(formaPago, monto, tarjeta, phone, userId) {
    this.purchaseData = new Purchase(formaPago, monto, tarjeta, phone, userId);
    return this.http.post(this.rootURL + 'pagoes', this.purchaseData).toPromise();
  }

  sellPoint(userId, buyer, amount) {
    const pointSell = new PointSell(userId, buyer, amount);
    return this.http.post(this.rootURL + 'VenderPuntos', pointSell).toPromise();
  }
}
