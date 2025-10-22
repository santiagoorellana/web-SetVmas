import { Injectable } from '@angular/core';
import { MotivoDenuncia } from '../../models/motivo-denuncia.model';
import { ConfiguracionesService } from '../../services/configuration/configuration.service';
import { Router } from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class MotivoDenunciaService {

  formData: MotivoDenuncia = new MotivoDenuncia(0, '', '');
  resultsLength = 0;
  pageIndex=1;
  pageSize=10;
  listaMotivosDenuncia: MotivoDenuncia[] = [];
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  tableColumns: string[] = ['MotivoDenunciaId', 'Nombre', 'Estado', 'Acciones'];
  dataSource = new MatTableDataSource<MotivoDenuncia>(this.listaMotivosDenuncia);
  currentUser: Usuario;
  // constructor() { }
  constructor(private http: HttpClient, private servConfiguracion: ConfiguracionesService, private router: Router,
    private toastr: ToastrService, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getMotivoDenuncia(col, filter, sortDirection,  pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'MotivoDenuncias', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      // map(res => {})
    );
    /*return this.http.get(this.rootURL + 'MotivoDenuncias').toPromise()
      .then(res => this.dataSource = new MatTableDataSource<MotivoDenuncia>(res as MotivoDenuncia[]));*/
  }

  getMotivoDenunciaByid(id) {
    if (+id === 0) {
      return this.formData = new MotivoDenuncia(0, '', '');
    }
    return this.http.get(this.rootURL + 'MotivoDenuncias/' + id).toPromise()
      .then(res => this.formData = res as MotivoDenuncia);
  }


  salvarCambios() {
    if (this.formData.MotivoDenunciaId === 0) {
      this.postMotivoDenuncia();
    } else {
      this.putMotivoDenuncia();
    }
  }

  postMotivoDenuncia() {
    this.http.post(this.rootURL + 'MotivoDenuncias', this.formData).subscribe(
      res => {
        this.router.navigate(['/admin/nomencladores/motivos-denuncia']);
        this.getMotivoDenuncia('Nombre', '', 'asc',this.pageIndex, this.pageSize);
        this.toastr.success('Se insertó correctamente', 'Motivo de Denuncia');
      },
      err => {
        this.toastr.success('Error durante la inserción', 'Motivo de Denuncia');

      }
    );
  }
  putMotivoDenuncia() {
    this.http.put(this.rootURL + 'MotivoDenuncias/' + this.formData.MotivoDenunciaId, this.formData).subscribe(
      res => {
        this.router.navigate(['/admin/nomencladores/motivos-denuncia']);
        this.getMotivoDenuncia('Nombre', '', 'asc' ,this.pageIndex, this.pageSize);
         this.toastr.success('Se actualizó correctamente', 'Motivo de Denuncia');

  },
  err => {
  this.toastr.success('Error durante la actualización', 'Motivo de Denuncia');
}
    );
  }

  deleteMotivoDenuncia(id, datasource) {

    this.http.delete(this.rootURL + 'MotivoDenuncias/' + id).subscribe(
      res => {


        this.router.navigate(['/admin/nomencladores/motivos-denuncia']);
        datasource.loadMotivos('Nombre', '', 'asc',this.pageIndex, this.pageSize);
        this.toastr.success('Se eliminó correctamente', 'Motivo de Denuncia');
      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Motivo de Denuncia');

      }

    );

  }

  getMotivoDenunciaCount() {
    this.http.get(this.rootURL + 'MotivoDenuncias/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }

}
