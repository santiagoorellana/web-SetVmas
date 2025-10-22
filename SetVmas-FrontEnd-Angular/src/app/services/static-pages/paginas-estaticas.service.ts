import { Injectable } from '@angular/core';

import {HttpClient, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { PaginasEstaticasModel } from 'src/app/models/paginas-estaticas.model';
import { ConfiguracionesService } from '../configuration/configuration.service';


@Injectable()
export class PaginasEstaticasService {
  formData: PaginasEstaticasModel = new PaginasEstaticasModel( 0, '', '' ) ;
  listaPaginas: PaginasEstaticasModel[] = [];
  resultsLength=0;
  pageIndex=1;
  pageSize=10;

  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient,
              private servConfiguracion: ConfiguracionesService,
              private router: Router,
              private  toastr: ToastrService) { }


    salvarCambios() {
      if (this.formData.PaginasEstaticasId === 0) {
         this.postPaginasEstaticas();
      } else {
         this.putPaginasEstaticas();
      }
    }

  postPaginasEstaticas() {
    this.http.post(this.rootURL + 'PaginasEstaticas' , this.formData).subscribe(
      res => {
        this.router.navigate(['paginasestaticas']);
        this.getPaginasEstaticas('Titulo', '', 'asc', this.pageIndex, this.pageSize);
        this.toastr.success('Valor insertado correctamente ', 'Páginas Estáticas');

      },
      err => {
        this.toastr.error('Error durante la inserción ', 'Páginas Estáticas');

      }
    );

  }
  putPaginasEstaticas() {
      this.http.put(this.rootURL + 'PaginasEstaticas/' + this.formData.PaginasEstaticasId, this.formData).subscribe(
        res => {
          this.router.navigate(['/admin/paginas']);
          this.getPaginasEstaticas('Titulo', '', 'asc', this.pageIndex, this.pageSize);
          this.toastr.success('Valor actualizado correctamente ', 'Páginas Estáticas');
          /* this.toastr.success('Los factores de bonificación para el nivel ' +
             formData[i].FactoresBonificacionVentasId + ' han sido modificados', 'Factores de bonificación por Venta');*/
        },
        err => {
          this.toastr.error('Error durante la actualización ', 'Páginas Estáticas');
        }
      );
  }

  getPaginasEstaticas(col, filter, sortDirection,
  pageIndex, pageSize) {
  /*return this.http.get(this.rootURL + 'PaginasEstaticas').toPromise()
    .then(res => this.listaPaginas = res as PaginasEstaticasModel[]);*/


  return this.http.get(this.rootURL + 'PaginasEstaticas', {
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
getPaginasEstaticasCount() {
  this.http.get(this.rootURL + 'PaginasEstaticas/Count').subscribe((res) => { this.resultsLength = (res as number); });
}

  deletePaginasEstaticas(id, datasource) {
    this.http.delete(this.rootURL + 'PaginasEstaticas/' + id).subscribe(
      res => {

        this.toastr.success('Eliminación correcta', 'Páginas Estáticas');
        datasource.loadPEstaticas('Titulo', '', 'asc',this.pageIndex, this.pageSize);
      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Páginas Estáticas');
      }
    );
  }
  getPaginasEstaticasByid(id) {
    if (+id === 0) {
      return this.formData = new PaginasEstaticasModel(0, '', '');
    }
    return this.http.get(this.rootURL + 'PaginasEstaticas/' + id).toPromise()
      .then(res => this.formData = res as PaginasEstaticasModel);
  }


  enviarCorreo(nombre, correo, asunto, mensaje, captcha) {
    return this.http.get(this.rootURL + 'PaginasEstaticas/Correo', {
      params: new HttpParams()
        .set('nombre', nombre.toString())
        .set('correo', correo.toString())
        .set('asunto', asunto.toString())
        .set('mensaje', mensaje.toString())
        .set('captcha', captcha.toString())
    });
  }

}

