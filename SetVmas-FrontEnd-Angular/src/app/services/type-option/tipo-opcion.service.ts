import { Injectable } from '@angular/core';

import {HttpClient, HttpParams} from '@angular/common/http';
import {TipoOpcionModel} from '../../models/tipo-opcion.model';
import {ConfiguracionesService} from '../../services/configuration/configuration.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class TipoOpcionService {
  formData: TipoOpcionModel;
  listaClases: TipoOpcionModel[] = [];
  resultsLength=0;
  pageIndex=1;
  pageSize=10;

  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient,
              private servConfiguracion: ConfiguracionesService,
              private router: Router,
              private  toastr: ToastrService) { }


    salvarCambios() {
      if (this.formData.TipoOpcionId === 0) {
         this.postTipoOpcions();
      } else {
         this.putTipoOpcions();
      }
    }

  postTipoOpcions() {
    this.http.post(this.rootURL + 'TipoOpcions' , this.formData).subscribe(
      res => {
        this.router.navigate(['/admin/nomencladores/tipos-opciones']);
        this.getTipoOpcions('Nombre', '', 'asc',this.pageIndex, this.pageSize);
        this.toastr.success('El valor se insertó correctamente', 'Tipos de Opción Avanzada');

      },
      err => {
        this.toastr.error('Error durante la operación', 'Tipos de Opción Avanzada');

      }
    );

  }
  putTipoOpcions() {
      this.http.put(this.rootURL + 'TipoOpcions/' + this.formData.TipoOpcionId, this.formData).subscribe(
        res => {
          this.router.navigate(['/admin/nomencladores/tipos-opciones']);
          this.getTipoOpcions('Nombre', '', 'asc',this.pageIndex, this.pageSize);
          this.toastr.success('El valor se actualizó correctamente', 'Tipos de Opción Avanzada');
        },
        err => {
          this.toastr.error('Error durante la operación', 'Tipos de Opción Avanzada');

        }
      );
  }

  getTipoOpcions(col, filter, sortDirection, pageIndex, pageSize) {
    /*return this.http.get(this.rootURL + 'PaginasEstaticas').toPromise()
      .then(res => this.listaPaginas = res as PaginasEstaticasModel[]);*/


    return this.http.get(this.rootURL + 'TipoOpcions', {
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
  getTipoOpcionsCount() {
    this.http.get(this.rootURL + 'TipoOpcions/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }

  deleteTipoOpcions(id, datasource) {
    this.http.delete(this.rootURL + 'TipoOpcions/' + id).subscribe(
      res => {

        this.toastr.success('Eliminación correcta', 'Tipo de Opción Avanzada');
        datasource.loadTOpciones('Nombre', '', 'asc', this.pageIndex, this.pageSize);
      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Tipo de Opción Avanzada');

      }
    );
  }
  getTipoOpcionsByid(id) {
    if (+id === 0 || id === undefined) {
      return this.formData = new TipoOpcionModel(0, '', '','', 0, 0,0);
    }
    return this.http.get(this.rootURL + 'TipoOpcions/' + id).toPromise()
      .then(res => this.formData = res as TipoOpcionModel);
  }
  getTipoOpcionsByCodigo(codigo) {
    return this.http.get(this.rootURL + 'TipoOpcions/Codigo/' + codigo).toPromise();
  }

  getTipoOpcionsAll(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'TipoOpcions', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();

  }

  getTipoOpcionsAllAdminAnu(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'TipoOpcions/AdminAnu', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();

  }

}
