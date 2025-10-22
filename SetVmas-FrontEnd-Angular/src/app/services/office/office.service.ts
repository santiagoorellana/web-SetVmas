import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {ConfiguracionesService} from '../configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient,
              private servConfiguracion: ConfiguracionesService,
              private router: Router
  ) { }

  getCantidadReferidos(id) {
    return this.http.get(this.rootURL + 'Usuarios/ReferidosCount/' + id).toPromise();
  }

 /*getListaReferidos( id ) {
    return this.http.get(this.rootURL + 'Usuarios/ReferidosList/' + id).toPromise();
  }*/

    getListaReferidos(col, filter, sortDirection,  pageIndex, pageSize) {
        return this.http.get(this.rootURL + 'Usuarios/ReferidosList', {
            params: new HttpParams()
                .set('col', col.toString())
                .set('filter', filter)
                .set('sortDirection', sortDirection)
                .set('pageIndex', pageIndex.toString())
                .set('pageSize', pageSize.toString())
        }).pipe(
            // map(res => {})
        );
    }


    getCantidadAnuncios(id) {
    return this.http.get(this.rootURL + 'Anuncios/UsuarioCount/' + id).toPromise();
  }

  /*getListaAnuncio( id ) {
    //return this.http.get(this.rootURL + 'Usuarios/Anuncios/' + id).toPromise();
    return this.http.get(this.rootURL + 'Anuncios/Usuarios/' + id).toPromise();
  }*/
  getListaAnuncio(col, filter, sortDirection,  pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Anuncios/Usuarios', {
      params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
    }).pipe(
        // map(res => {})
    );
  }
  getMensaje() {
    return this.http.get(this.rootURL + 'VariableConfiguracions/Codigo', {
      params: new HttpParams()
        .set('codigo', 'MEN_ADM_OV')

    }).toPromise();
  }
}
