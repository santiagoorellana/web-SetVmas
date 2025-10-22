import { Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Pago } from '../../models/pago.model';
import { ConfiguracionesService } from '../configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  formData: Pago;
  resultsLength = 0;
  pageIndex=1;
  pageSize=10;

  listaPagos: Pago[] = [];
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  dataSource = new MatTableDataSource<Pago>(this.listaPagos);

  constructor(public http: HttpClient, public servConfiguracion: ConfiguracionesService, public router: Router,
    public toastr: ToastrService) {
  }

  getPagos(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Pagoes', {
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


  getPagosCount() {
    this.http.get(this.rootURL + 'Pagoes/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }

  getPagoPuntosCount(id) {

    return this.http.get(this.rootURL + 'Pagoes/PuntosCount/' + id).toPromise();
  }

  deletePagos(id, dataSource) {
    this.http.delete(this.rootURL + 'Pagoes/' + id).subscribe(
      res => {
        this.router.navigate(['/admin/pagos']);
        dataSource.loadCPago('Fecha', '', 'desc', this.pageIndex, this.pageSize);

      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Pagos');
      }
    );
  }

  confirmarCompra(/*id*/lista, dataSource) {

    this.http.post(this.rootURL + 'Pagoes/Confirmar', lista).toPromise().then(
      res => {
        dataSource.loadCPago('Fecha', '', 'desc', this.pageIndex, this.pageSize);

      }
    );
  }

  putPagos(navega = true) {
    this.http.put(this.rootURL + 'Pagoes/' + this.formData.PagoId, this.formData).subscribe(
      res => {

        this.getPagos('Fecha', '', 'asc', this.pageIndex, this.pageSize);
        this.toastr.success('El valor ha sido modificado', 'Pagos');
        if(navega)
        this.router.navigate(['pago']);
      },
      err => {
        this.toastr.error('Error durante la actualización ' , 'Pagos');


      }
    );
  }
  getPagosById(id) {
    if (+id === 0) {
      return this.formData = new Pago();
    }
    return this.http.get(this.rootURL + 'Pagoes/' + id).toPromise()
      .then(res => this.formData = res as Pago);
  }

}
