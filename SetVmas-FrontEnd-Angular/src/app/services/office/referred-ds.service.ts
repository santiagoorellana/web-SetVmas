import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Usuario } from '../../models/usuario.model';
import { OfficeService } from './office.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';

@Injectable({
  providedIn: 'root'
})
export class ReferredDsService implements DataSource<Usuario> {
  public data: Usuario[]; //Zuleidy esto es para que me funcione el selectall
  private listarUsuariosSubject = new BehaviorSubject<Usuario[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(public servOffice: OfficeService, private loadingService:LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<Usuario[]> {
    return this.listarUsuariosSubject.asObservable().pipe( //Zuleidy esto es para que me funcione el selectall
        tap((data) => this.data = data),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.listarUsuariosSubject.complete();
    this.loadingSubject.complete();
  }
  loadUsuarios(columna: string, filter: number,
               sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingSubject.next(true);
    this.loadingService.showLoading(true);
    this.servOffice.getCantidadReferidos(filter);
    this.servOffice.getListaReferidos(columna, filter, sortDirection, pageIndex, pageSize)
        .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
    )
        .subscribe(res => {
          this.listarUsuariosSubject.next((res as Usuario[]));
          //this.servAnu.resultsLength = (anuncios as AnunciosModel[]).length;

        });
  }

}
