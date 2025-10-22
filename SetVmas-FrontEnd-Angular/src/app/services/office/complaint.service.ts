import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfiguracionesService } from '../../services/configuration/configuration.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Denuncia } from '../../models/denuncia.model';


@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  resultsLength = 0;
  readonly rootURL = this.servConfiguracion.getRootURLApi();

  constructor(private http: HttpClient, private servConfiguracion: ConfiguracionesService, private router: Router) {
  }


  getComplaintsByUser( Id,pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Denuncias/User/' + Id, {
      params: new HttpParams()
        .set('Id', Id)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      // map(res => {})
    );
  }

  GetDenunciaCountByUser(userId) {
    this.http.get(this.rootURL + 'Denuncias/Count/'+userId).subscribe((res) => { this.resultsLength = (res as number); });
  }

}
