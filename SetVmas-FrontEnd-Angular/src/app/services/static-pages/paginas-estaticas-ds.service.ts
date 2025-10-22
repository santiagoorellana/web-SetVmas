import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { PaginasEstaticasService } from './paginas-estaticas.service';
import { catchError, finalize } from 'rxjs/operators';
import { PaginasEstaticasModel } from 'src/app/models/paginas-estaticas.model';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';


export class PaginasEstaticasDataSource implements DataSource<PaginasEstaticasModel> {

  private paginasEstaticasSubject = new BehaviorSubject<PaginasEstaticasModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

    constructor(private servPE: PaginasEstaticasService,private loadingService: LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<PaginasEstaticasModel[]> {

    return this.paginasEstaticasSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.paginasEstaticasSubject.complete();
    this.loadingSubject.complete();
  }
  loadPEstaticas(columna: string, filter: string,
    sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
   this.servPE.getPaginasEstaticasCount();
    this.servPE.getPaginasEstaticas(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
    )
      .subscribe(pestaticas => {
        this.paginasEstaticasSubject.next((pestaticas as PaginasEstaticasModel[]));
        if ((pestaticas as PaginasEstaticasModel[]).length < 10)
        this.servPE.resultsLength = (pestaticas as PaginasEstaticasModel[]).length;
      });
  }
}
