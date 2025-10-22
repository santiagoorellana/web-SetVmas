import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize } from 'rxjs/operators';
import { TipoTransferencia } from '../../models/tipo-transferencia.model';
import { TipoTransferenciaService } from './tipo-transferencia.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';


export class TipoTransferenciaServiceDataSource implements DataSource<TipoTransferencia> {

  private tipoTransferenciaSubject = new BehaviorSubject<TipoTransferencia[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servTT: TipoTransferenciaService,private loadingService: LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<TipoTransferencia[]> {
    return this.tipoTransferenciaSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.tipoTransferenciaSubject.complete();
    this.loadingSubject.complete();
  }
  loadTipoTransfer(columna: string, filter: string,
                 sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
   // this.servTT.getTipoTransferenciaCount();
    this.servTT.getTipoTransferencia(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(ctransfers => {
        this.tipoTransferenciaSubject.next((ctransfers as TipoTransferencia[]));
        if ((ctransfers as TipoTransferencia[]).length<10)
        this.servTT.resultsLength = (ctransfers as TipoTransferencia[]).length;
      });
  }
}
