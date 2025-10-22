import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ClasesUsuariosModel} from '../../models/clases-usuarios.model';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { ConfiguracionesService } from '../configuration/configuration.service';

@Injectable()
export class ClasesUsuariosService {
  formData: ClasesUsuariosModel;
  listaClases: ClasesUsuariosModel[] = [];
  resultsLength = 0;
  pageIndex=1;
  pageSize=10;
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient,
              private servConfiguracion: ConfiguracionesService,
              private router: Router,
              private  toastr: ToastrService) { }


    salvarCambios() {
      if (this.formData.ClasesUsuariosId === 0) {
         this.postClasesUsuarios();
      } else {
         this.putClasesUsuarios();
      }
    }

  postClasesUsuarios() {
    this.http.post(this.rootURL + 'ClasesUsuarios' , this.formData).subscribe(
      res => {
        this.router.navigate(['/admin/nomencladores/clases-usuarios']);
        this.getClasesUsuarios('Nombre', '', 'asc', this.pageIndex , this.pageSize);
        this.toastr.success('Valor insertado correctamente', 'Clases de Usuarios');
      },
      err => {
         this.toastr.error('Error durante la operación', 'Clases de Usuarios');
      }
    );

  }
  putClasesUsuarios() {
      this.http.put(this.rootURL + 'ClasesUsuarios/' + this.formData.ClasesUsuariosId, this.formData).subscribe(
        res => {

          this.getClasesUsuarios('Nombre', '', 'asc', this.pageIndex , this.pageSize);
          this.toastr.success('El valor ha sido modificado', 'Clases de Usuarios');
          this.router.navigate(['/admin/nomencladores/clases-usuarios']);
        },
        err => {
          this.toastr.error('Error durante la actualización ', 'Clases de Usuarios');
        }
      );
  }

  getClasesUsuarios(col, filter, sortDirection,  pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'ClasesUsuarios', {
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
  getClasesUsuariosCount() {
  this.http.get(this.rootURL + 'ClasesUsuarios/Count').subscribe((res) => { this.resultsLength = (res as number); });
}

  getClaseList() {
    return this.http.get(this.rootURL + 'ClasesUsuarios/List').toPromise()
      .then(res => this.listaClases = res as ClasesUsuariosModel[]);
  }

  deleteClasesUsuarios(id , datasource) {

    this.http.delete(this.rootURL + 'ClasesUsuarios/' + id).subscribe(
      res => {
        this.toastr.success('El valor ha sido eliminado', 'Clases de Usuarios');
        datasource.loadCusuarios('Nombre', '', 'asc', this.pageIndex , this.pageSize);
      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Clases de Usuarios');

      }

    );

  }
  getClasesUsuariosByid(id) {
    if (+id === 0 || id === undefined) {
      return this.formData = new ClasesUsuariosModel(0, '', 0, 0, 0, 0, 0, 0, 0);
    }
    return this.http.get(this.rootURL + 'ClasesUsuarios/' + id).toPromise()
      .then(res => { this.formData = res as ClasesUsuariosModel});
  }



}
