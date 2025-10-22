import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize } from 'rxjs/operators';
import {PaginasEstaticasModel} from '../../models/paginas-estaticas.model';
import {PaginasEstaticasService} from '../../services/static-pages/paginas-estaticas.service';
import {TipoOpcionModel} from '../../models/tipo-opcion.model';
import {TipoOpcionService} from './tipo-opcion.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';

export class TipoOpcionDataSource implements DataSource<TipoOpcionModel> {

  private tipoOpcionSubject = new BehaviorSubject<TipoOpcionModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servTO: TipoOpcionService,private loadingService: LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<TipoOpcionModel[]> {
    return this.tipoOpcionSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.tipoOpcionSubject.complete();
    this.loadingSubject.complete();
  }
  loadTOpciones(columna: string, filter: string, sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servTO.getTipoOpcionsCount();
    this.servTO.getTipoOpcions(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(topcion => {
        this.tipoOpcionSubject.next((topcion as TipoOpcionModel[]));
        if ((topcion as TipoOpcionModel[]).length<10)
        this.servTO.resultsLength = (topcion as TipoOpcionModel[]).length;
      });
  }
}
