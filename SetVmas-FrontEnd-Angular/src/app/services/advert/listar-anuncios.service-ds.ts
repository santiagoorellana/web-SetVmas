import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AnunciosModel } from '../../models/anuncios.model';
import { AnunciosService } from './anuncios.service';
import { Injectable } from '@angular/core';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';

@Injectable()
export class ListarAnunciosServiceDataSource implements DataSource<AnunciosModel> {
  public data: AnunciosModel[]; //Zuleidy esto es para que me funcione el selectall
  private listarAnunciosSubject = new BehaviorSubject<AnunciosModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(public servAnu: AnunciosService, private loadingService:LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<AnunciosModel[]> {
    //return this.listarAnunciosSubject.asObservable();
    return this.listarAnunciosSubject.asObservable().pipe( //Zuleidy esto es para que me funcione el selectall
      tap((data) => this.data = data),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.listarAnunciosSubject.complete();
    this.loadingSubject.complete();
  }
  loadAnuncios(columna: string, filter: string, rol:string,inactividad:string,renovacion:string,
                 sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingSubject.next(true);
    this.loadingService.showLoading(true);
    this.servAnu.getAnunciosCount();
    this.servAnu.getAnuncios(columna, filter, rol, inactividad, renovacion, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(anuncios => {
        this.listarAnunciosSubject.next((anuncios as AnunciosModel[]));
        //this.servAnu.resultsLength = (anuncios as AnunciosModel[]).length;

      });
  }

}
