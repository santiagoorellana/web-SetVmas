import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize } from 'rxjs/operators';
import {Categoria} from '../../models/categoria.model';
import {CategoryService} from './category.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';

export class CategoryServiceDataSource implements DataSource<Categoria> {

  private categoriaSubject = new BehaviorSubject<Categoria[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servCat: CategoryService, private loadService: LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<Categoria[]> {
    return this.categoriaSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.categoriaSubject.complete();
    this.loadingSubject.complete();
  }
  loadCcategoria(columna: string, filter: string,
                 sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadService.showLoading(true);
    this.loadingSubject.next(true);
    this.servCat.getCategoriaCount();
    this.servCat.getCategoria(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadService.showLoading(false);
        })
      )
      .subscribe(categorias => {
      /*  for (let i of (categorias as Categoria[] )) {
          i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
        }*/
        this.categoriaSubject.next((categorias as Categoria[]));
        if ((categorias as Categoria[]).length < 10)
          this.servCat.resultsLength = (categorias as Categoria[]).length;
      });
  }
}
