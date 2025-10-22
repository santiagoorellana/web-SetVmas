import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Transfer } from '../../models/transfer.model';
import {TransfersService} from './transfers.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';

export class TransfersServiceDataSource implements DataSource<Transfer> {
 public data: Transfer[];
  private transferenciaSubject = new BehaviorSubject<Transfer[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servT: TransfersService,private loadingService:LoadingIndicatorService) {

  }

  connect(collectionViewer: CollectionViewer): Observable<Transfer[]> {
    return this.transferenciaSubject.asObservable().pipe(
      tap((data) => this.data = data),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.transferenciaSubject.complete();
    this.loadingSubject.complete();
  }

  loadTransfers(userId: number, opTypePagoPublicidad: boolean, opTypeVenta: boolean, opTypeBonificacion: boolean, opTypeCompraDirecta: boolean, idTransfer: string, sourceUser: string, targetUser: string, dateFrom: string, dateTo: string, pointsFrom: string, pointsTo: string, pageIndex: number, pageSize: number) {

    this.loadingSubject.next(true);
      this.loadingService.showLoading(true);
      this.servT.getTransferenciaCountByUsuario(userId);
    this.servT.getTransfers(userId, opTypePagoPublicidad, opTypeVenta, opTypeBonificacion, opTypeCompraDirecta,idTransfer, sourceUser,targetUser, dateFrom, dateTo, pointsFrom, pointsTo, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
            this.loadingSubject.next(false);
            this.loadingService.showLoading(false);
        })
      )
      .subscribe(ctran => {
        this.transferenciaSubject.next((ctran as Transfer[]));
        if ((ctran as Transfer[]).length<10)
        this.servT.resultsLength = (ctran as Transfer[]).length;
      });
  }
}
