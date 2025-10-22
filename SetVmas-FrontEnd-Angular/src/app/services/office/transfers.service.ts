import { Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Transfer } from '../../models/transfer.model';
import { ConfiguracionesService } from '../../services/configuration/configuration.service';
import { MatTableDataSource } from '@angular/material/table';


@Injectable({
  providedIn: 'root'
})
export class TransfersService {

  resultsLength = 0;
  listaTransferencia: Transfer[] = [];
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  dataSource = new MatTableDataSource<Transfer>(this.listaTransferencia);

  constructor(private http: HttpClient, private servConfiguracion: ConfiguracionesService, private router: Router) {
  }

  getTransfers(userId, opTypePagoPublicidad, opTypeVenta, opTypeBonificacion, opTypeCompraDirecta,idTransfer, sourceUser,targetUser, dateFrom, dateTo, pointsFrom, pointsTo,  pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Transferencias/User/' + userId, {
      params: new HttpParams()
        .set('opTypePagoPublicidad', opTypePagoPublicidad)
        .set('opTypeVenta', opTypeVenta)
        .set('opTypeBonificacion', opTypeBonificacion)
        .set('opTypeCompraDirecta', opTypeCompraDirecta)
        .set('idTransfer', idTransfer)
        .set('sourceUser', sourceUser)
        .set('targetUser', targetUser)
        .set('dateFrom', dateFrom)
        .set('dateTo', dateTo)
        .set('pointsFrom', pointsFrom)
        .set('pointsTo', pointsTo)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(

    );
  }
  getTransferenciaCount() {
    this.http.get(this.rootURL + 'Transferencias/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }
  getTransferenciaCountByUsuario(userId) {
    this.http.get(this.rootURL + 'Transferencias/Count/'+userId).subscribe((res) => { this.resultsLength = (res as number); });
  }
}
