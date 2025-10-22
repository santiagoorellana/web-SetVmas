import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
// import { ConfiguracionesService } from '../../../shared/servicio-configuraciones/configuraciones.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Denuncia } from '../../models/denuncia.model';
import { ConfiguracionesService } from '../configuration/configuration.service';
import {AuthenticationService} from "../auth/authentication.service";
import {Usuario} from "../../models/usuario.model";


@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  formData: Denuncia;
  resultsLength = 0;
  pageIndex = 1;
  pageSize = 10;

  readonly rootURL = this.servConfiguracion.getRootURLApi();
  listEstados: string[];
  currentUser: Usuario;

  constructor(public http: HttpClient, public servConfiguracion: ConfiguracionesService, public router: Router,
              public toastr: ToastrService, private authenticationService: AuthenticationService) {
    this.listEstados = this.servConfiguracion.getEstadosDenuncias();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getDenuncias(col, estado, antiguedad, anuncio, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Denuncias', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('estado', estado)
        .set('antiguedad', antiguedad.toString())
        .set('anuncio', anuncio.toString())
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      // map(res => {})
    );
  }

  getDenunciaCount() {
    this.http.get(this.rootURL + 'Denuncias/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }

  deleteDenuncia(id, dataSource) {
    this.http.delete(this.rootURL + 'Denuncias/' + id).subscribe(
      res => {
        this.router.navigate(['/admin/denuncias']);
        dataSource.loadCDenuncia('FechaCreacion', '', '', '', 'asc', this.pageIndex, this.pageSize);
      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Denuncias');
      }
    );
  }

  putDenuncias() {
    if ( this.formData.UsuarioId === this.currentUser.UsuarioId || this.formData.AnuncioUsuarioId === this.currentUser.UsuarioId ) {

      this.toastr.error('Usted no puede clasificar esta denuncia', 'Denuncia');
      return;
    }
    this.formData.UsuarioClasificaId = this.currentUser.UsuarioId;
    if (this.formData.Estado === 'Procede') {
       if (confirm('Esta operación no puede ser revertida. ¿Está seguro de que desea continuar con el cambio?')) {

         this.http.put(this.rootURL + 'Denuncias/' + this.formData.DenunciaId, this.formData).subscribe(
           res => {
             this.getDenuncias('FechaCreacion', '', '', '', 'desc',  this.pageIndex, this.pageSize);
             this.toastr.success('El valor ha sido modificado', 'Denuncia');
             this.router.navigate(['/admin/denuncias']);
           },
           err => {
             console.log(err);
             this.toastr.error('Error durante la actualización ', 'Denuncia');
           }
         );
       }
    } else {
      this.http.put(this.rootURL + 'Denuncias/' + this.formData.DenunciaId, this.formData).subscribe(
        res => {
          this.getDenuncias('FechaCreacion', '', '', '', 'desc',  this.pageIndex, this.pageSize);
          this.toastr.success('El valor ha sido modificado', 'Denuncia');
          this.router.navigate(['/admin/denuncias']);
        },
        err => {
          this.toastr.error('Error durante la actualización ', 'Denuncia');
        }
      );
    }

  }

  getDenunciasByid(id) {
    console.log('id ' + id);
    if (+id === 0 || id === undefined) {
      return this.formData = new Denuncia(0, '', new Date(), null, null, null, null);
    }

    return this.http.get(this.rootURL + 'Denuncias/' + id).toPromise()
      .then(res => {
        // console.log(this.formData);
        this.formData = res as Denuncia;

      });
  }

  postDenuncia(denuncia: Denuncia) {
    this.http.post(this.rootURL + 'Denuncias', denuncia).subscribe(
      res => {
         if ((res as string) === 'auto-denuncia') {
           this.toastr.error('No puede denunciar un anuncio propio', 'Denuncia');
         } else
        this.toastr.success('Se insertó correctamente', 'Denuncia');
      },
      err => {
        this.toastr.error('Error durante la inserción', 'Denuncia');
      }
    );
  }

}
