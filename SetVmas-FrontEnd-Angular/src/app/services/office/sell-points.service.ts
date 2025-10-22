import { Injectable } from '@angular/core';
import { ConfiguracionesService } from '../../services/configuration/configuration.service';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../models/usuario.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { PointSell } from '../../models/sell-points.model';


@Injectable({
  providedIn: 'root'
})
export class SellPointService {

  readonly rootURL = this.servConfiguracion.getRootURLApi();
  private pointsellModel: PointSell;

  constructor(public http: HttpClient, public servConfiguracion: ConfiguracionesService, public router: Router,
    public toastr: ToastrService) {
  }


  postVentaPuntos(userId, buyer, amount) {
    this.pointsellModel = new PointSell(userId, buyer, amount);

    return this.http.post(this.rootURL + 'VenderPuntos', this.pointsellModel);
  }
}
