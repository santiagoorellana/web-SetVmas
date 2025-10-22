import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize } from 'rxjs/operators';
import {MotivoDenunciaService} from './motivo-denuncia.service';
import {MotivoDenuncia} from '../../models/motivo-denuncia.model';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';


export class MotivoDenunciaServiceDataSource implements DataSource<MotivoDenuncia> {

  private motivoDenunciaSubject = new BehaviorSubject<MotivoDenuncia[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servMD: MotivoDenunciaService,private loadingService: LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<MotivoDenuncia[]> {
    return this.motivoDenunciaSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.motivoDenunciaSubject.complete();
    this.loadingSubject.complete();
  }
  loadMotivos(columna: string, filter: string,
                 sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servMD.getMotivoDenunciaCount();
    this.servMD.getMotivoDenuncia(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(cmotivos => {
        this.motivoDenunciaSubject.next((cmotivos as MotivoDenuncia[]));
        if ((cmotivos as MotivoDenuncia[]).length < 10)
          this.servMD.resultsLength = (cmotivos as MotivoDenuncia[]).length;
      });
  }
}
