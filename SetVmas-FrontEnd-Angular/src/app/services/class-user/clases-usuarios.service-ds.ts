import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize } from 'rxjs/operators';
import {ClasesUsuariosModel} from '../../models/clases-usuarios.model';
import {ClasesUsuariosService} from './clases-usuarios.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';


export class ClasesUsuariosServiceDataSource implements DataSource<ClasesUsuariosModel> {

  private clasesUsuariosSubject = new BehaviorSubject<ClasesUsuariosModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servCU: ClasesUsuariosService,private loadingService: LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<ClasesUsuariosModel[]> {
    return this.clasesUsuariosSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.clasesUsuariosSubject.complete();
    this.loadingSubject.complete();
  }
  loadCusuarios(columna: string, filter: string,
                 sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servCU.getClasesUsuariosCount();
    this.servCU.getClasesUsuarios(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(cusuarios => {
        this.clasesUsuariosSubject.next((cusuarios as ClasesUsuariosModel[]));
        if ((cusuarios as ClasesUsuariosModel[]).length < 10)
        this.servCU.resultsLength = (cusuarios as ClasesUsuariosModel[]).length;
      });
  }
}
