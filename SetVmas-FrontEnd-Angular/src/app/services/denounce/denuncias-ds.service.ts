import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Denuncia } from '../../models/denuncia.model';
import { DenunciaService } from './denuncia.service';
import {MatTableDataSource} from '@angular/material/table';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';

@Injectable({
  providedIn: 'root'
})
export class DenunciasDsService implements DataSource<Denuncia> {
  public data: Denuncia[];
  private denunciaSubject = new BehaviorSubject<Denuncia[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(public servD: DenunciaService,private loadingService: LoadingIndicatorService) { }

  connect(collectionViewer: CollectionViewer): Observable<Denuncia[]> {
    // return this.denunciaSubject.asObservable();
    return this.denunciaSubject.asObservable().pipe(
      tap((data) => this.data = data),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.denunciaSubject.complete();
    this.loadingSubject.complete();
  }
  loadCDenuncia(columna: string, estado: string, antiguedad: string, anuncio: string,
    sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servD.getDenunciaCount();
    this.servD.getDenuncias(columna, estado, antiguedad, anuncio, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(ctran => {
        this.denunciaSubject.next((ctran as Denuncia[]));
        if ((ctran as Denuncia[]).length<10) {
          this.servD.resultsLength = (ctran as Denuncia[]).length;
        }

      });
  }

}
