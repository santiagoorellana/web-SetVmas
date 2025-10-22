import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AnunciosModel } from '../../models/anuncios.model';
import { OfficeService } from './office.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';

@Injectable({
  providedIn: 'root'
})
export class AdvertService implements DataSource<AnunciosModel> {
  public data: AnunciosModel[]; //Zuleidy esto es para que me funcione el selectall
  private listarAnunciosSubject = new BehaviorSubject<AnunciosModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(public servOffice: OfficeService, private loadingService:LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<AnunciosModel[]> {
    //return this.listarAnunciosSubject.asObservable();
    return this.listarAnunciosSubject.asObservable().pipe( //Zuleidy esto es para que me funcione el selectall
        tap((data) => this.data = data)
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.listarAnunciosSubject.complete();
    this.loadingSubject.complete();
  }
  loadAnuncios(columna: string, filter: number,
               sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingSubject.next(true);
    this.loadingService.showLoading(true);
    this.servOffice.getCantidadAnuncios(filter);
    this.servOffice.getListaAnuncio(columna, filter, sortDirection, pageIndex, pageSize)
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
