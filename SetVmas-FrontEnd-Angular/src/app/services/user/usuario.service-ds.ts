import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize, tap } from 'rxjs/operators';
import {Usuario} from '../../models/usuario.model';
import {UsuarioService} from './usuario.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';


export class UsuarioServiceDataSource implements DataSource<Usuario> {

  public data: Usuario[]; //Zuleidy esto es para que me funcione el selectall
  private usuarioSubject = new BehaviorSubject<Usuario[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servU: UsuarioService, private loadingService: LoadingIndicatorService) {}

  connect(collectionViewer: CollectionViewer): Observable<Usuario[]> {
  //  return this.usuarioSubject.asObservable();
    return this.usuarioSubject.asObservable().pipe( //Zuleidy esto es para que me funcione el selectall
      tap((data) => this.data = data),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usuarioSubject.complete();
    this.loadingSubject.complete();
  }
  loadUsuarios(columna: string, rol: string, correo: string, clase: string, puntos: string, diasInactividad: string, fechaCreacion: string, sortDirection: string, pageIndex: number, pageSize: number, codigo: string) {
    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servU.getUsuarioCount();
    this.servU.getUsuarios(columna, rol, correo, clase, puntos, diasInactividad, fechaCreacion, sortDirection, pageIndex, pageSize, codigo)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(cusuarios => {
        this.usuarioSubject.next((cusuarios as Usuario[]));
        if ((cusuarios as Usuario[]).length < 10)
        this.servU.resultsLength = (cusuarios as Usuario[]).length;
      });
  }
}


