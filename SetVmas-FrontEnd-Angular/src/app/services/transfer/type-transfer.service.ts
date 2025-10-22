import { Injectable } from '@angular/core';
import {TipoTransferencia} from '../../models/tipo-transferencia.model';
import {MatTableDataSource} from '@angular/material/table';
import {Usuario} from '../../models/usuario.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ConfiguracionesService} from '../configuration/configuration.service';
import {AuthenticationService} from '../auth/authentication.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TipoTransferenciaService {


  resultsLength = 0;
  formData: TipoTransferencia = new TipoTransferencia(0, '', 0, '');
  listaTipoTransferencia: TipoTransferencia[] = [];
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  tableColumns: string[] = ['TipoTransferenciaId', 'Nombre', 'Cantidad', 'Acciones'];
  dataSource = new MatTableDataSource<TipoTransferencia>(this.listaTipoTransferencia);
  currentUser: Usuario;

  constructor(private http: HttpClient, private servConfiguracion: ConfiguracionesService, private router: Router,
              private toastr: ToastrService, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);}

  getTipoTransferencia(col, filter, sortDirection,  pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'TipoTransferencias', {
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

  getTipoTransferenciaByid(id) {
    if (+id === 0) {
      return this.formData = new TipoTransferencia(0, '', 0, '');
    }
    return this.http.get(this.rootURL + 'TipoTransferencias/' + id).toPromise()
      .then(res => this.formData = res as TipoTransferencia);
  }
  getTipoTransferenciaByCodigo(codigo) {
    return this.http.get(this.rootURL + 'TipoTransferencias/Codigo/' + codigo).toPromise();
  }


  salvarCambios() {
    if (this.formData.TipoTransferenciaId === 0) {
      this.postTipoTransferencia();
    } else {
      this.putTipoTransferencia();
    }
  }

  postTipoTransferencia() {
    this.http.post(this.rootURL + 'TipoTransferencias', this.formData).subscribe(
      res => {
        console.log('Tdo OK');
        this.router.navigate(['tipoTransferencia']);
        this.getTipoTransferencia('Nombre', '', 'asc', '1', '10');
        this.toastr.success('Se insertó correctamente', 'Tipo Transferencias');
      },
      err => {
        this.toastr.success('Error durante la inserción', 'Tipo Transferencias');
      }
    );
  }
  putTipoTransferencia() {
    this.http.put(this.rootURL + 'TipoTransferencias/' + this.formData.TipoTransferenciaId, this.formData).subscribe(
      res => {
        console.log('Tdo OK');
        this.router.navigate(['tipoTransferencia']);
        this.getTipoTransferencia('Nombre', '', 'asc', '1', '10');
        this.toastr.success('Se actualizó correctamente', 'Tipo Transferencias');
      },
      err => {
        this.toastr.success('Error durante la actualización', 'Tipo Transferencias');
      }
    );
  }

  deleteTipoTransferencia(id, datasource) {

    this.http.delete(this.rootURL + 'TipoTransferencias/' + id).subscribe(
      res => {

        this.router.navigate(['tipoTransferencia']);
        datasource.loadTipoTransfer('Nombre', '', 'asc', 1, 10);
        this.toastr.success('Se eliminó correctamente', 'Tipo Transferencias');
      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Motivo de Denuncia');

      }

    );

  }
  getTipoTransferenciaCount() {
    this.http.get(this.rootURL + 'TipoTransferencias/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }

}
