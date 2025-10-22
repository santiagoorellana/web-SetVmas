import {DataSource} from '@angular/cdk/table';
import {FactoresbonificacionventasModel} from '../../models/factoresbonificacionventas.model';
import {FactoresbonificacionventasService} from './factoresbonificacionventas.service';
import {CollectionViewer} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';

import { catchError, finalize } from 'rxjs/operators';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';

export class FactoresbonificacionventasServiceDataSource implements DataSource<FactoresbonificacionventasModel> {

  private fbvSubject = new BehaviorSubject<FactoresbonificacionventasModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servFBV: FactoresbonificacionventasService,private loadingService: LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<FactoresbonificacionventasModel[]> {
    return this.fbvSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.fbvSubject.complete();
    this.loadingSubject.complete();
  }
  loadFBV() {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servFBV.getFactoresBonificacionVentas()
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(facbonif => {
        this.fbvSubject.next((facbonif as FactoresbonificacionventasModel[]));
      });
  }
}
