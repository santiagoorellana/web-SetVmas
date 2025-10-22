import { Injectable } from '@angular/core';
import { Etiqueta } from '../../models/etiqueta.model';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize } from 'rxjs/operators';
import { EtiquetaService } from './etiqueta.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';


@Injectable({
  providedIn: 'root'
})
export class EtiquetaDsService implements DataSource<Etiqueta> {

  private etiquetasSubject = new BehaviorSubject<Etiqueta[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  cont: number = 0;
  constructor(private service: EtiquetaService,private loadingService: LoadingIndicatorService) { }

  connect(collectionViewer: CollectionViewer): Observable<Etiqueta[]> {
    return this.etiquetasSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.etiquetasSubject.complete();
    this.loadingSubject.complete();
  }
  loadCetiquetas(columna: string, filter: string,
    sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.service.getEtiquetasCount(filter);
    this.service.getEtiquetas(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(cusuarios => {
        this.etiquetasSubject.next((cusuarios as Etiqueta[]));
        if (true) {

        }
        if ((cusuarios as Etiqueta[]).length < 10) {
          this.service.resultsLength = (cusuarios as Etiqueta[]).length;
        }

      });
  }
}
