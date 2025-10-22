import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize, tap } from 'rxjs/operators';
import {Transferencia} from '../../models/transferencia.model';
import {TransferenciaService} from './transferencia.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';


export class TransferenciaServiceDataSource implements DataSource<Transferencia> {
 public data: Transferencia[]; //Zuleidy esto es para que me funcione el selectall
  private transferenciaSubject = new BehaviorSubject<Transferencia[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servT: TransferenciaService, private loadingService: LoadingIndicatorService ) {}

  connect(collectionViewer: CollectionViewer): Observable<Transferencia[]> {
    //return this.transferenciaSubject.asObservable();
    return this.transferenciaSubject.asObservable().pipe( //Zuleidy esto es para que me funcione el selectall
      tap((data) => this.data = data),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.transferenciaSubject.complete();
    this.loadingSubject.complete();
  }
  loadCTransferencia(columna: string, filter: string,
                 sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servT.getTransferenciaCount();
    this.servT.getTransferencia(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() =>{
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(ctran => {
        console.log('resulto '+JSON.parse(JSON.stringify(ctran)));
        this.transferenciaSubject.next((ctran as Transferencia[]));
        if ((ctran as Transferencia[]).length<10)
        this.servT.resultsLength = (ctran as Transferencia[]).length;
      });
  }

  loadCTransferenciaByAntiguedad(columna: string, filter: string,
                     sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servT.getTransferenciaCount();
    this.servT.getTransferenciaByAntiguedad(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(ctran => {
        this.transferenciaSubject.next((ctran as Transferencia[]));
        if ((ctran as Transferencia[]).length < 10)
          this.servT.resultsLength = (ctran as Transferencia[]).length;
      });
  }

}
