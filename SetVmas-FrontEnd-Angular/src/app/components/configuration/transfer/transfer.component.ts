import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Transferencia } from '../../../models/transferencia.model';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {merge} from 'rxjs/internal/observable/merge';
import { ToastrService } from 'ngx-toastr';
import { TransferenciaService } from 'src/app/services/transfer/transferencia.service';
import { TransferenciaServiceDataSource } from 'src/app/services/transfer/transferencia.service-ds';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Usuario } from 'src/app/models/usuario.model';
import { LoadingIndicatorService } from 'src/app/services/loading/loading-indicator.service';
import {MatDialog} from '@angular/material/dialog';
import {DeleteComponent} from '../../common/modals/delete/delete.component';
import { PageEvent } from '@angular/material/paginator';



// const initialSelection = [];
// const allowMultiSelect = true;
// this.selection = new SelectionModel<Transferencia>(allowMultiSelect, initialSelection);

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('antigueda', { static: true }) antigueda: ElementRef;
  dataSource ;
  tableColumns: string[] = ['select', 'TransferenciaId', 'UsuarioFuente', 'UsuarioDestino', 'Usuario',
  'Fecha', 'Puntos', 'TipoTransferencia']; // Acciones
  selection = new SelectionModel<Transferencia>(true, []);
  currentUser: Usuario;

  constructor(public service: TransferenciaService, private router: Router, public dialog: MatDialog, private loading: LoadingIndicatorService,
    private actRoute: ActivatedRoute, public toastr: ToastrService, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.dataSource = new TransferenciaServiceDataSource(this.service, this.loading);
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.service.pageIndex-1;
  this.paginator.pageSize=this.service.pageSize;

    if (this.currentUser.Rol === 'Cliente') {
      this.dataSource.loadCTransferencia('Fecha', this.currentUser.Correo, 'desc', this.service.pageIndex, this.service.pageSize);
    } else {
      this.dataSource.loadCTransferencia('Fecha', '', 'desc', this.service.pageIndex, this.service.pageSize);

    }
}
  onEdit(id) {
    this.router.navigate(['add', +id], { relativeTo: this.actRoute });
  }

  onDelete(id) {

    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(Boolean(JSON.parse(result))){
        this.service.deleteTransferencia(id, this.dataSource);
        this.toastr.success('Se ha eliminado la transferencia correctamente', 'Transferencia');
      }
    });

    // if (confirm('Seguro desea eliminar este elemento?')) {
    //   this.service.deleteTransferencia(id, this.dataSource);
    //   this.toastr.success('Se ha eliminado la transferencia correctamente', 'Transferencia');
    // }
  }


  // *********************Seleccionar y eliminar una o varias filas*****************************
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Transferencia): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }
  removeSelectedRows() {
    if (this.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(DeleteComponent, {
        width: '285px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if(Boolean(JSON.parse(result)))
        {
          this.selection.selected.forEach(item => {
            const index: number = this.dataSource.data.findIndex(d => d === item);
            this.dataSource.data.splice(index, 1);
            this.service.deleteTransferencia(item.TransferId, this.dataSource); // eliminar transferenecia
          });
          this.selection = new SelectionModel<Transferencia>(true, []);
          this.toastr.success('Se han eliminado las transferencias correctamente.', 'Transferencias');
        }
      });

    }
    else
      this.toastr.error('Se debe selecionar un elemento de la lista.', 'Transferencias');
  }
  // *********************Seleccionar y eliminar una o varias filas***************************************

  // ****************Filtro************************
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
    // ****************Filtro************************


  ngAfterViewInit(): void {
    // if (this.antigueda !== undefined) {
    fromEvent(this.antigueda.nativeElement, 'change')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadTransferenciasByAntiguedadPage();
        })
      )
      .subscribe();
    // }

    // server-side search
    // if (this.antigueda !== undefined) {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex = 1;
          this.loadTransferenciasPage();
        })
      )
      .subscribe();
    // }

    // reset the paginator after sorting
    // if (this.antigueda !== undefined) {
  //  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadTransferenciasPage())
      )
      .subscribe();
    // }
  }

  loadTransferenciasPage() {
    this.dataSource.loadCTransferencia(
      this.sort.active,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize);
  }

  loadTransferenciasByAntiguedadPage() {
    this.dataSource.loadCTransferenciaByAntiguedad(
      this.sort.active,
      this.antigueda.nativeElement.value,
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
