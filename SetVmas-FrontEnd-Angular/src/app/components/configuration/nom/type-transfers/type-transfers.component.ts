import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TipoTransferencia } from '../../../../models/tipo-transferencia.model';
import { ConfiguracionesService } from '../../../../services/configuration/configuration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TipoOpcionService } from '../../../../services/type-option/tipo-opcion.service';
import { TipoTransferenciaService } from '../../../../services/type-transfers/tipo-transferencia.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {ClasesUsuariosServiceDataSource} from '../../../../services/class-user/clases-usuarios.service-ds';
import {TipoTransferenciaServiceDataSource} from '../../../../services/type-transfers/tipo-transferencia.service-ds';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {merge} from 'rxjs/internal/observable/merge';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { Usuario } from '../../../../models/usuario.model';
import {LoadingIndicatorService} from '../../../../services/loading/loading-indicator.service';
import {MatDialog} from '@angular/material/dialog';
import {DeleteComponent} from '../../../common/modals/delete/delete.component';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-type-transfers',
  templateUrl: './type-transfers.component.html',
  styleUrls: ['./type-transfers.component.css']
})
export class TypeTransfersComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;
  dataSource;

  constructor(public service: TipoTransferenciaService,public dialog: MatDialog,  private router: Router,
   private actRoute: ActivatedRoute,private loading: LoadingIndicatorService) {
   }

  ngOnInit() {

    this.dataSource = new TipoTransferenciaServiceDataSource(this.service, this.loading);
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.service.pageIndex-1;
  this.paginator.pageSize=this.service.pageSize;


  this.dataSource.loadTipoTransfer('Nombre', '', 'asc', this.service.pageIndex, this.service.pageSize);
  }
  applyFilter(filterValue: string) { // filtrar
    this.service.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(id) {
    this.router.navigate(['add', +id], { relativeTo: this.actRoute });
  }
  onDelete(id) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '285px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(Boolean(JSON.parse(result)))
      {
        this.service.deleteTipoTransferencia(id, this.dataSource);
      }
    });
    // if (confirm('Seguro desea eliminar este elemento?')) {
    //   this.service.deleteTipoTransferencia(id, this.dataSource);
    //
    // }
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
  ngAfterViewInit(): void {

    // server-side search
    if(this.input){
      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
            this.paginator.pageIndex = 0;
            this.service.pageIndex = 1;
            this.loadTipoTranferPage();
          })
        )
        .subscribe();

      // reset the paginator after sorting
    //  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadTipoTranferPage())
        )
        .subscribe();
    }
  }

  loadTipoTranferPage() {
    this.dataSource.loadTipoTransfer(
      this.sort.active,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize);
  }
getPaginatorData(event:PageEvent)
{
  this.service.pageIndex=event.pageIndex+1;
  if(this.service.pageSize!=event.pageSize)
  {
    this.service.pageSize=event.pageSize;
    this.service.pageIndex=1;
    this.paginator.pageIndex=this.service.pageIndex-1;
    this.paginator.pageSize=this.service.pageSize;

  }

}
  ngOnDestroy(): void {
    this.sort.sortChange.unsubscribe();
  }

}
