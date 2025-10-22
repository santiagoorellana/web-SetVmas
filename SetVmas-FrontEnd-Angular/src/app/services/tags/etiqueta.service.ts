import { Injectable } from '@angular/core';
import { Etiqueta } from '../../models/etiqueta.model';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from '../../models/categoria.model';
import { CategoriaEtiqueta } from '../../models/categoria-etiqueta.model';
import { ConfiguracionesService } from '../configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {
  formData: Etiqueta = new Etiqueta(0, '', 0,true, []);
  listaEtiqueta: Etiqueta[] = [];
  listaEtiquetaNombre: string[] = [];
  resultsLength = 0;

  pageIndex=1;
  pageSize=10;

  dataSource = new MatTableDataSource<Etiqueta>(this.listaEtiqueta);

 // categories: Categoria[] = [];
  readonly rootURL = this.servConfiguracion.getRootURLApi();


  constructor(public http: HttpClient,
              public servConfiguracion: ConfiguracionesService,
              public router: Router,
              public toastr: ToastrService) {
    this.pageIndex=1;
    this.pageSize=10;
  }


  getEtiquetas(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Etiquetas', {
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
  getEtiquetasAll(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Etiquetas', {
      params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
    }).toPromise();
  }
  getEtiquetasCount(filter) {
    this.http.get(this.rootURL + 'Etiquetas/Count', {
      params: new HttpParams()
        .set('filter', filter)
    } ).subscribe((res) => { this.resultsLength = (res as number); });
  }


  getEtiquetasNombre(lista: string[]) {
    this.http.get(this.rootURL + 'Etiquetas/Nombre').toPromise()
      .then(res => lista = res as string[]);

  }

 
  getEtiquetaByid(id) {
    if (+id === 0 || id === undefined) {
      this.formData = new Etiqueta(0, '', 0,true, []);
      this.formData.Categorias=[];
      return this.formData;

    }
    return this.http.get(this.rootURL + 'Etiquetas/' + id).toPromise()
        .then(res =>{this.formData = res as Etiqueta;} );
  }

  salvarCambios() {

    if(this.formData.Categorias.length==0)
      this.toastr.error('El campo categorias es obligatorio', 'Etiquetas');
    else
    {
      if (this.formData.EtiquetaId === 0) {
        this.postEtiqueta();
      } else {
        this.putEtiqueta();
      }

    }
  }



  postEtiqueta() {

  
   return this.http.post(this.rootURL + 'Etiquetas', this.formData).subscribe(
      res => {
        this.formData.EtiquetaId = (res as Etiqueta).EtiquetaId;
        this.toastr.success('Se insertó correctamente', 'Etiqueta');
        this.pageIndex=1;

        this.router.navigate(['/admin/etiquetas']);
      },
      err => {
        this.toastr.error('Error durante la insersión', 'Etiqueta');
      }
    );
  }

  postEtiquetaV2(etiqueta: Etiqueta) {
    return this.http.post(this.rootURL + 'Etiquetas', etiqueta).toPromise();
  }
  putEtiquetaV2(etiqueta: Etiqueta) {
    return this.http.put(this.rootURL + 'Etiquetas/' + etiqueta.EtiquetaId, etiqueta).toPromise();

  }


  //postEtiqueta() {
  //  this.http.post(this.rootURL + 'Etiquetas', this.formData).toPromise()
  //    .then(res => this.formData = res as Etiqueta);
  //}
  putEtiqueta() {
    this.http.put(this.rootURL + 'Etiquetas/' + this.formData.EtiquetaId, this.formData).subscribe(
      res => {
        this.toastr.success('Se actualizó correctamente', 'Etiqueta');
        this.pageIndex=1;
        this.getEtiquetas('Nombre', '', 'asc',this.pageIndex, this.pageSize);
        this.router.navigate(['/admin/etiquetas']);
      },
      err => {
        this.toastr.error('Error durante la actualizón', 'Etiqueta');

      }
    );
  }

  deleteEtiqueta(id, datasource) {
    this.http.delete(this.rootURL + 'Etiquetas/' + id).subscribe(
      res => {
        this.toastr.success('La etiqueta ha sido eliminada correctamente', 'Etiqueta');
        datasource.loadCetiquetas('Nombre', '', 'asc',this.pageIndex, this.pageSize);
        this.router.navigate(['/admin/etiquetas']);
      },
      err => {
        this.toastr.error('No se puede eliminar una etiqueta asociada a anuncios.', 'Etiqueta');
      }
    );
  }

  getCategoriaEtiquetaByEtiqueta(id) {
    return this.http.get(this.rootURL + 'CategoriaEtiquetas/Etiqueta/' + id).toPromise();
  }


}
