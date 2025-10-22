import { Injectable } from '@angular/core';
import { VariableConfiguracion } from '../../models/variable-configuracion.model';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { VariableConfiguracionService } from './variable-configuracion.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';


@Injectable({
  providedIn: 'root'
})
export class VariableConfiguracionDsService implements DataSource<VariableConfiguracion>{

  private variableSubject = new BehaviorSubject<VariableConfiguracion[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private servVC: VariableConfiguracionService,private loadingService: LoadingIndicatorService) { }

  connect(collectionViewer: CollectionViewer): Observable<VariableConfiguracion[]> {
    return this.variableSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.variableSubject.complete();
    this.loadingSubject.complete();
  }
  loadCVariable(columna: string, filter: string,
    sortDirection: string, pageIndex: number, pageSize: number) {

    this.loadingService.showLoading(true);
    this.loadingSubject.next(true);
    this.servVC.getVariableConfiguracionsCount("General");
    this.servVC.getVariableConfiguracion(columna, filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(ctran => {
        this.variableSubject.next((ctran as VariableConfiguracion[]));
        if ((ctran as VariableConfiguracion[]).length < 10)
          this.servVC.resultsLength = (ctran as VariableConfiguracion[]).length;
      });
  }

}
