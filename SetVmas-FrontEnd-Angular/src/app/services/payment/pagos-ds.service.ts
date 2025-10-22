import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Pago } from '../../models/pago.model';
import { PagosService } from './pagos.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';


export class PagosDsService implements DataSource<Pago> {
  public data: Pago[]; //Zuleidy esto es para que me funcione el selectall
  private pagoSubject = new BehaviorSubject<Pago[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servP: PagosService,private loadingService: LoadingIndicatorService) { }

  connect(collectionViewer: CollectionViewer): Observable<Pago[]> {
    //return this.pagoSubject.asObservable();
    return this.pagoSubject.asObservable().pipe( //Zuleidy esto es para que me funcione el selectall
      tap((data) => this.data = data),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.pagoSubject.complete();
    this.loadingSubject.complete();
  }
  loadCPago(columna: string, filter: string,
    sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servP.getPagosCount();
    this.servP.getPagos(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(ctran => {
        this.pagoSubject.next((ctran as Pago[]));
if((ctran as Pago[]).length<10)
        this.servP.resultsLength = (ctran as Pago[]).length;
      });
  }
}


