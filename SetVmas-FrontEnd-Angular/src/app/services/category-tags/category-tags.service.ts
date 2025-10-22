import { Injectable } from '@angular/core';
import {CategoriaEtiqueta} from '../../models/categoria-etiqueta.model';
import {ConfiguracionesService} from '../configuration/configuration.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CategoryTagsService {

  formData: CategoriaEtiqueta = new CategoriaEtiqueta(0, 0);
  listaCategoriaEtiqueta: CategoriaEtiqueta[] = [];
  listaCategoriaEtiquetaNombre: string[] = [];
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient, private servConfiguracion: ConfiguracionesService, private router: Router,
              private toastr: ToastrService) { }

  getCategoriaEtiqueta() {
    return this.http.get(this.rootURL + 'CategoriaEtiquetas').toPromise()
      .then(res => this.listaCategoriaEtiqueta = res as CategoriaEtiqueta[]);
  }

  //Devuelve las categoriasetiquetas segun el id de la categoria
  getCategoriaEtiquetaById(id) {

    return this.http.get(this.rootURL + 'CategoriaEtiquetas/' + id).toPromise()
      .then(res => this.listaCategoriaEtiquetaNombre = res as string[]);
  }
  putCategoriaEtiqueta() {
    console.log('PUT');
    this.http.put(this.rootURL + 'CategoriaEtiquetas/' + this.formData.CategoriaEtiquetaId, this.formData).subscribe(
      res => {
        this.getCategoriaEtiqueta();
        this.toastr.success('Se actualizó correctamente', 'Tipo Transferencias');
      },
      err => {
        this.toastr.success('Error durante la actualización', 'Tipo Transferencias');
      }
    );
  }

  postCategoriaEtiqueta() {
    console.log('POST');
    this.http.post(this.rootURL + 'CategoriaEtiquetas', this.formData).subscribe(
      res => {
        //  this.router.navigate(['categoria']);
        // this.getCategoria();
       this.toastr.success('Se insertó correctamente', 'Categoría Etiqueta');
      },
      err => {
       this.toastr.success('Error durante la inserción', 'Categoría Etiqueta');
      }
    );
  }

  deleteCategoria(id) {
    this.http.delete(this.rootURL + 'CategoriaEtiquetas/' + id).subscribe(
      res => {
        this.getCategoriaEtiqueta();
        this.toastr.success('Se eliminó correctamente', 'Tipo Transferencias');
      },
      err => {
        this.toastr.success('Error durante la eliminación', 'Tipo Transferencias');
      }
    );
  }
}
