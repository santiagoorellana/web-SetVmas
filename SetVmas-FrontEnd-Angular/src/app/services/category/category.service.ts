import { Injectable } from '@angular/core';
import {CategoriaEtiqueta} from '../../models/categoria-etiqueta.model';
import {Categoria} from '../../models/categoria.model';
import {MatTableDataSource} from '@angular/material/table';
import {Etiqueta} from '../../models/etiqueta.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ConfiguracionesService} from '../configuration/configuration.service';
import {Router} from '@angular/router';
import {CategoryTagsService} from '../category-tags/category-tags.service';
import {ToastrService} from 'ngx-toastr';
import { EtiquetaService } from '../tags/etiqueta.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  listaCE: CategoriaEtiqueta[] = [];
  formData: Categoria = new Categoria(0, '', '', '', '', 0);
  resultsLength = 0;
  pageIndex:number;
  pageSize:number;

  listaCategoria: Categoria[] = [];
  listaEtiqueta: number[] = [];
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  tableColumns: string[] = ['CategoriaId', 'Nombre', 'ImageName', 'CantAutoRenovables', 'Acciones'];
  dataSource = new MatTableDataSource<Categoria>(this.listaCategoria);
  allFruits: Etiqueta[] = [];
  fruits: Etiqueta[] = [];
  ce: CategoriaEtiqueta = new CategoriaEtiqueta(0, 0);

  constructor(public http: HttpClient, public servConfiguracion: ConfiguracionesService, public router: Router,
              public toastr: ToastrService, public servEtiqueta: EtiquetaService, public servCE: CategoryTagsService) {
    this.pageIndex=1;
    this.pageSize=10;
  }


  getListaEtiquetas() {
    this.http.get(this.rootURL + 'Etiquetas/List').toPromise()
      .then(res => this.allFruits = res as Etiqueta[]);

  }

  /*getCategoriaEtiquetaById(id) {
    this.fruits = [];
    return this.http.get(this.rootURL + 'Categorias/Etiqueta/' + id).toPromise()
      .then(res => this.fruits = res as Etiqueta[]);
  }*/



  getCategoria(col, filter, sortDirection,  pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Categorias', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex)
        .set('pageSize', pageSize)
    }).pipe(
      // map(res => {})
    );

  }
  getCategoriaCount() {
    this.http.get(this.rootURL + 'Categorias/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }

  getCategoriaById(id) {
    if (+id === 0 || id === undefined) {
      this.formData = new Categoria(0, '', '', '','', 0);
      this.formData.Etiquetas=[];
      return this.formData;

    }
    return this.http.get(this.rootURL + 'Categorias/' + id).toPromise()
      .then(res =>{this.formData = res as Categoria;
          this.fruits=this.formData.Etiquetas;
        } );
  }


  salvarCambios() {
    if (this.formData.CategoriaId === 0) {
      this.postCategoria2();

    } else {

      this.putCategoria2();
    }



  }

  postCategoria() {
    return this.http.post(this.rootURL + 'Categorias', this.formData).subscribe(
      res => {
        this.formData.CategoriaId = (res as Categoria).CategoriaId;
        this.toastr.success('Se insertó correctamente', 'Categoría');
      },
      err => {
        this.toastr.error('Error durante la inserción', 'Categoría');
      }
    );
  }
  postCategoria2() {
    return this.http.post(this.rootURL + 'Categorias', this.formData).subscribe(
      res => {
        this.formData.CategoriaId = (res as Categoria).CategoriaId;
        this.toastr.success('Se insertó correctamente', 'Categoría');
        this.pageIndex=1;
        this.getCategoria('Nombre', '', 'asc', this.pageIndex, this.pageSize);
        this.router.navigate(['/admin/categorias']);
      },
      err => {
        this.toastr.error('Error durante la inserción', 'Categoría');
      }
    );
  }
  putCategoria() {
    this.http.put(this.rootURL + 'Categorias/' + this.formData.CategoriaId, this.formData).subscribe(
      res => {
        this.toastr.success('Se actualizó correctamente', 'Categoría');
      },
      err => {
        this.toastr.error('Error durante la actualización', 'Categoría');
      }
    );
  }

  putCategoria2() {
    this.http.put(this.rootURL + 'Categorias/' + this.formData.CategoriaId, this.formData).subscribe(
      res => {
        this.toastr.success('Se actualizó correctamente', 'Categoría');
        this.pageIndex=1;
        this.getCategoria('Nombre', '', 'asc',this.pageIndex, this.pageSize);
        this.router.navigate(['/admin/categorias']);
      },
      err => {
        this.toastr.error('Error durante la actualización', 'Categoría');
      }
    );
  }

  postCategoriaV3(categoria: Categoria) {
    return this.http.post(this.rootURL + 'Categorias', categoria).toPromise();
  }
  putCategoriaV3(categoria: Categoria) {
    return this.http.put(this.rootURL + 'Categorias/' + categoria.CategoriaId, categoria).toPromise();

  }



  deleteCategoria(id, datasource) {
    this.http.delete(this.rootURL + 'Categorias/' + id).subscribe(
      res => {
      //  this.getCategoria('Nombre', '', 'asc', this.pageIndex, this.pageSize);
        datasource.loadCcategoria('Nombre', '', 'asc',this.pageIndex, this.pageSize);
        this.router.navigate(['/admin/categorias']);
        this.toastr.success('Se eliminó correctamente', 'Categoría');
      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Categoría');
      }
    );
  }

  getCategoriaEtiquetaByCategoria(id) {
    return this.http.get(this.rootURL + '/CategoriaEtiquetas' + id).toPromise()
      .then(res => this.listaEtiqueta = res as number[]);
  }



  /**
   * Metodo para obtener todas las categorias para combo o lisxtbox
   * @author @SanPanda
   * @param col
   * @param filter
   * @param sortDirection
   * @param pageIndex
   * @param pageSize
   */
  getCategoriasAll(col, filter, sortDirection,  pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Categorias', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex)
        .set('pageSize', pageSize)
    }).toPromise( );

  }

  getEtiquetasByCategoria(id) {

    if (id === 0 || id === undefined) {
      return this.http.get(this.rootURL + 'Etiquetas/List').toPromise();
    } else {
      return this.http.get(this.rootURL + 'Categorias/Etiqueta/' + id).toPromise();
    }
  }

  getUrl(){
    return this.http.get(this.rootURL + 'Banners/url2');

  }
  // getImage(imageUrl: string) {
  //
  //   return this.http.get(this.rootURL + 'Banners/url', { responseType: ResponseContentType.Blob })
  //     .map((res: Response) => res.blob());
  // }
  getImage2(): Observable<Blob> {
    return this.http.get(this.rootURL + 'Banners/url', {responseType: "blob"});
  }
}
