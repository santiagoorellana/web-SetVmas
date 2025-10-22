import { Injectable } from '@angular/core';
import {AnunciosModel} from '../../models/anuncios.model';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ConfiguracionesService} from '../configuration/configuration.service';
import {BuscarAnunciosModel} from '../../models/buscar-anuncio.model';

@Injectable({
  providedIn: 'root'
})
export class AnunciosService {

  formData: AnunciosModel;
  resultsLength = 0;
  pageIndex=0;
  pageSize=0;

  readonly rootURL = this.servConfiguracion.getRootURLApi();


  // ***************************Para carcgar id de anuncio a ver en detalle***************************************************
  public verAnuncio = new BehaviorSubject<AnunciosModel>(null);
  public visto$ = this.verAnuncio.asObservable();

  // ************************************************************************************************

  // ***************************Para saber cuando se inserto un anuncio***************************************************
  public insertoAnuncio = new BehaviorSubject<boolean>(false);
  public insertado$ = this.insertoAnuncio.asObservable();

  // ************************************************************************************************


  // ***************************Para saber cuando se inserto o edita por el id de un anuncio***************************************
  public idAnuncio = new BehaviorSubject<number>(0);
  public anuncio = this.idAnuncio.asObservable();

  // ************************************************************************************************


  constructor(private http: HttpClient,
              private servConfiguracion: ConfiguracionesService,
              private router: Router,
              private toastr: ToastrService) { }


  salvarCambios() {
    if (this.formData.AnuncioId === 0) {
      this.postAnuncios();
    } else {
      this.putAnuncios();
    }
  }

  postAnuncios() {
    this.http.post(this.rootURL + 'Anuncios' , this.formData).subscribe(
      res => {
        this.router.navigate(['listaranuncios']);
        this.getAnuncios('FechaCreacion', '', '', '', '', 'asc', this.pageIndex, this.pageSize);
        this.toastr.success('Valor insertado correctamente', 'Anuncios');
      },
      err => {
        console.log('Error durante la actualización');
        this.toastr.error('Error durante la operación', 'Anuncios');
      }
    );

  }

  postAnunciosV2(anuncio: AnunciosModel) {

    anuncio.FechaCreacion = new Date();
    anuncio.FechaModificacion = new Date();

    return this.http.post(this.rootURL + 'Anuncios', anuncio).toPromise();

  }
  putAnuncios() {
    this.http.put(this.rootURL + 'Anuncios/' + this.formData.AnuncioId, this.formData).subscribe(
      res => {

        this.getAnuncios('FechaCreacion', '', '', '', '', 'asc', this.pageIndex, this.pageSize);
        this.toastr.success('El valor ha sido modificado correctamente.', 'Anuncios');
        this.router.navigate(['listaranuncios']);
      },
      err => {
        this.toastr.error('Error durante la actualización ', 'Anuncios');
      }
    );
  }

  putAnunciosV2(anuncio: AnunciosModel) {
    return this.http.put(this.rootURL + 'Anuncios/' + anuncio.AnuncioId, anuncio).toPromise();

  }



  getAnuncios(col, filter, rol, inactividad, renovacion, sortDirection,  pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Anuncios', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('rol', rol)
        .set('inactividad', inactividad)
        .set('renovacion', renovacion)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      // map(res => {})
    );
  }
  getAnunciosCount() {
    this.http.get(this.rootURL + 'Anuncios/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }


  getAnunciosV2(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Anuncios', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise(
      // map(res => {})
    );
  }
  getAnunciosCountV2(col, filter, sortDirection, pageIndex, pageSize, metodo) {
    return this.http.get(this.rootURL + 'Anuncios/CountHome', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('metodo', metodo.toString())
    }).toPromise();

  }

  deleteAnuncios(id , datasource) {

    this.http.delete(this.rootURL + 'Anuncios/' + id).subscribe(
      res => {
        this.router.navigate(['/listaranuncios']);
        datasource.loadAnuncios('FechaCreacion', '', '', '', '', 'desc',this.pageIndex, this.pageSize);

      },
      err => {
        this.toastr.error('Error durante la eliminación', 'Anuncios');

      }

    );

  }
  getAnunciosByid(id) {
    if (+id === 0) {
      return this.formData = new AnunciosModel(0, '',  '', '', '',
        '', 0, false, false, null, null, '', '', '', '', '', '', 0, false, '1', '','');
    }
    return this.http.get(this.rootURL + 'Anuncios/' + id).toPromise()
      .then(res => this.formData = res as AnunciosModel);
  }

  getAnunciosByidV2(id) {
    return this.http.get(this.rootURL + 'Anuncios/' + id).toPromise();
  }
  buscarAnunciosPopulares(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Anuncios/Populares', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();
  }


  buscarAnunciosRecientes(col, filter, sortDirection, pageIndex, pageSize) {
    return this.http.get(this.rootURL + 'Anuncios/Recientes', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    }).toPromise();
  }

  deleteAnunciosV2(id) {
    console.log('el id es:' + id);
    return this.http.delete(this.rootURL + 'Anuncios/' + id).toPromise();
  }


  ocultarMostrarAnuncio(id ) {
    this.http.get(this.rootURL + 'Anuncios/Ocultar/' + id).subscribe(
      res => {

        this.toastr.success('El valor ha sido modificado', 'Anuncios');
      },
      err => {
        this.toastr.error('Error durante la actualización ', 'Anuncios');
        return false;
      }
    );
    return true;
  }

  ocultarMostrarAnuncioV2(id) {
    return this.http.get(this.rootURL + 'Anuncios/Ocultar/' + id).toPromise();

  }
  ocultarMostrarAnuncioV3(id, dataSource) {

    return this.http.get(this.rootURL + 'Anuncios/Ocultar/' + id).subscribe(
      res => {
        dataSource.loadAnuncios('FechaCreacion', '', '', '', '', 'desc', 1, 10);
        this.router.navigate(['/listaranuncios']);
      }
    );
  }



  buscarAnunciosAvanzados(buscar: BuscarAnunciosModel) {
    if (buscar.PrecioMax === null || buscar.PrecioMax === undefined) {
      buscar.PrecioMax = 0;
    }
    if (buscar.PrecioMin === null || buscar.PrecioMin === undefined) {
      buscar.PrecioMin = 0;
    }
    return this.http.post(this.rootURL + 'Anuncios/Avanzados', buscar).toPromise();

  }
  buscarAnunciosAvanzadosCount (buscar: BuscarAnunciosModel) {
    return this.http.post(this.rootURL + 'Anuncios/AvanzadosCount', buscar).toPromise();


  }


  //Zuleidy Get Opciones Avanazadas
  getBanners(tipo) {
    return this.http.get(this.rootURL + 'Banners/Tipo/' + tipo).toPromise();
  }

  ///**
  // * Este metodo suma uno a la cantidad de views del anuncio
  // * y lo retorna actualizado
  // * @param anuncio
  // */
  anuncioVisto(anuncio: AnunciosModel) {
    return this.http.get(this.rootURL + 'Anuncios/AnuncioVisto/' + anuncio.AnuncioId).toPromise();
  }

}
