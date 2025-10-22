import { Injectable } from '@angular/core';
import { VariableConfiguracion } from '../../models/variable-configuracion.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfiguracionesService } from '../../services/configuration/configuration.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class VariableConfiguracionService {
  formData: VariableConfiguracion = new VariableConfiguracion(0, '', '','','');
  listaVariables: VariableConfiguracion[] = [];
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  tableColumns: string[] = ['Nombre', 'Valor', 'Acciones'];
  dataSource = new MatTableDataSource<VariableConfiguracion>(this.listaVariables);
  resultsLength = 0;
  pageIndex=1;
  pageSize=10;


  constructor(public http: HttpClient, public servConfiguracion: ConfiguracionesService, public router: Router,
    private toastr: ToastrService) {
  }



  getVariableConfiguracion(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'VariableConfiguracions', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex)
        .set('pageSize', pageSize)
    }).pipe(
      // map(res => {})
    );
  }

  getVariableConfiguracionPuntos(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'VariableConfiguracions/Puntos', {
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
  getVariableConfiguracionPagos(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'VariableConfiguracions/Pago', {
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
  getVariableConfiguracionBonificacion(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'VariableConfiguracions/Bonificacion', {
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

  getVariableConfiguracionByid(id) {
    if (+id === 0) {
      return this.formData = new VariableConfiguracion(0, '', '','','')
    }
    return this.http.get(this.rootURL + 'VariableConfiguracions/' + id).toPromise()
      .then(res => this.formData = res as VariableConfiguracion);
  }
  getVariableConfiguracionByCodigo(codigo) {
    return this.http.get(this.rootURL + 'VariableConfiguracions/Codigo/' + codigo).toPromise();
  }

  //getVariableConfiguracionsCount(tipo:string) {
  //  this.http.get(this.rootURL + 'VariableConfiguracions/Count').subscribe((res) => { this.resultsLength = (res as number); });
  //}

  getVariableConfiguracionsCount(tipo) {


    return this.http.get(this.rootURL + 'VariableConfiguracions/Count/' + tipo).toPromise()
      .then(res => this.resultsLength = (res as number));
  }

  salvarCambios() {

    if (this.formData.VariableConfiguracionId === 0) {
      this.postVariableConfiguracion();
    } else {
      this.putVariableConfiguracion();
    }
  }

  postVariableConfiguracion() {

    this.http.post(this.rootURL + 'VariableConfiguracions', this.formData).subscribe(
      res => {

        /* this.toastr.success('Los factores de bonificación para el nivel ' +
           formData[i].FactoresBonificacionVentasId + ' han sido modificados', 'Factores de bonificación por Venta');*/
        this.router.navigate(['/admin/variables']);
        this.getVariableConfiguracion('Nombre', '', 'asc', this.pageIndex, this.pageSize);
        this.toastr.success('Se insertó correctamente', 'Variable de Configuración');
      },
      err => {
        this.toastr.error('Error durante la inserción', 'Variable de Configuracións');

      }
    );
  }

  putVariableConfiguracion() {

    this.http.put(this.rootURL + 'VariableConfiguracions/' + this.formData.VariableConfiguracionId, this.formData).subscribe(
      res => {
        /* this.toastr.success('Los factores de bonificación para el nivel ' +
           formData[i].FactoresBonificacionVentasId + ' han sido modificados', 'Factores de bonificación por Venta');*/
        this.router.navigate(['/admin/variables']);
        this.getVariableConfiguracion('Nombre', '', 'asc', this.pageIndex, this.pageSize);

       this.toastr.success('Se actualizó correctamente', 'Variable de Configuración');

  },
  err => {
  this.toastr.success('Error durante la actualización', 'Variable de Configuración');
}
    );
  }


  deleteVariableConfiguracion(VariabeConfiguarcionId:number) {

    this.http.delete(this.rootURL + 'VariableConfiguracions/' + VariabeConfiguarcionId).subscribe(
      res => {
        this.getVariableConfiguracion('Nombre', '', 'asc',this.pageIndex, this.pageSize);
        this.toastr.success('Se eliminó correctamente', 'Variable de Configuración');
      },
      err => {
        this.toastr.success('Error durante la eliminación', 'Variable de Configuración');
      }
    );
  }
}
