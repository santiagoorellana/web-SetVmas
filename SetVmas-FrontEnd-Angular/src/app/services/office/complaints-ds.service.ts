import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs/';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Denuncia } from '../../models/denuncia.model';
import { ComplaintService } from './complaint.service';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintDsService implements DataSource<Denuncia> {
  public data: Denuncia[];
  private denunciaSubject = new BehaviorSubject<Denuncia[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(public servD: ComplaintService, private loadingService:LoadingIndicatorService) { }

  connect(collectionViewer: CollectionViewer): Observable<Denuncia[]> {
    // return this.denunciaSubject.asObservable();
    return this.denunciaSubject.asObservable().pipe(
      tap((data) => this.data = data),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.denunciaSubject.complete();
    this.loadingSubject.complete();
  }
  loadCComplaint(Id: number,pageIndex: number, pageSize: number) {

    this.loadingSubject.next(true);
    this.loadingService.showLoading(true);
    this.servD.GetDenunciaCountByUser(Id);
    this.servD.getComplaintsByUser(Id, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
          this.loadingService.showLoading(false);
        })
      )
      .subscribe(ctran => {
        this.denunciaSubject.next((ctran as Denuncia[]));

      });
  }

}
