import { Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Transferencia } from '../../models/transferencia.model';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguracionesService } from '../configuration/configuration.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  resultsLength = 0;
  pageIndex: number;
  pageSize: number;

  listaTransferencia: Transferencia[] = [];
  formData: Transferencia;
  readonly rootURL = this.servConfiguracion.getRootURLApi();

  constructor(private http: HttpClient, private servConfiguracion: ConfiguracionesService, private router: Router,
              private toastr: ToastrService) {
    this.pageIndex=1;
    this.pageSize=10;
}

  getTransferencia(col, filter, sortDirection,  pageIndex, pageSize) {

    return this.http.get(this.rootURL + 'Transferencias', {
      params: new HttpParams()
        .set('col', col)
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
       //map(res => {})
    );
  }
  getTransferenciaByAntiguedad(col, filter, sortDirection,  pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Transferencias/Antiguedad', {
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

  getTransferenciaCount() {
    this.http.get(this.rootURL + 'Transferencias/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }
  deleteTransferencia(id, dataSource) {
    this.http.delete(this.rootURL + 'Transferencias/' + id).subscribe(
      res => {
        this.router.navigate(['/admin/transferencias']);
        dataSource.loadCTransferencia('OperationDate', '', 'desc',this.pageIndex, this.pageSize);
      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Transferencia');
      }
    );
  }
  postTransferencia(trans: Transferencia) {
    return this.http.post(this.rootURL + 'Transferencias', trans).subscribe(
      res => {
        this.getTransferencia('OperationDate', '', 'desc', this.pageIndex, this.pageSize);
        this.router.navigate(['/admin/transferencias']);
      },
      err => {
        this.toastr.error('Error durante la operación', 'Transferencia');
      }
    );



  }

  putTransferencia(trans: Transferencia) {
    this.http.post(this.rootURL + 'Transferencias' + this.formData.TransferId, this.formData).subscribe(
      res => {

        this.toastr.success('El valor se actualizó correctamente', 'Transferencia');

      },
      err => {
        this.toastr.error('Error durante la operación', 'Transferencia');

      }
    );

  }
  getTransferenciaByid(id) {
    if (+id === 0) {
      return this.formData = new Transferencia(0, new Date(), 0, '', '', '', '');
    }
    return this.http.get(this.rootURL + 'Transferencias/' + id).toPromise()
      .then(res => this.formData = res as Transferencia);
  }
  salvarCambios() {
    if (this.formData.TransferId === 0) {
      this.postTransferencia(this.formData);
    } else {
      this.putTransferencia(this.formData);
    }
  }


}
