import { Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import { ConfiguracionesService } from '../../services/configuration/configuration.service';
import { Purchase } from '../../models/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private purchaseData: Purchase;
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient, private servConfiguracion: ConfiguracionesService, private router: Router) {
  }

  getPurchaseViewData() {
    return this.http.get(this.rootURL + 'pagoes/compra');
  }


  salvarCompra(formaPago, monto, tarjeta, phone, userId, TipoTransferencia ) {
    this.purchaseData = new Purchase(formaPago, monto, tarjeta, phone, userId, TipoTransferencia);
    return this.http.post(this.rootURL + 'pagoes', this.purchaseData);
    }

}
