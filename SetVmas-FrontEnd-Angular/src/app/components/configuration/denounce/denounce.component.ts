import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { Denuncia } from '../../../models/denuncia.model';
import { DenunciaService } from '../../../services/denounce/denuncia.service';
import { DenunciasDsService } from '../../../services/denounce/denuncias-ds.service';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Usuario } from '../../../models/usuario.model';
import { ToastrService } from 'ngx-toastr';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import {MatDialog} from '@angular/material/dialog';
import {DeleteComponent} from '../../common/modals/delete/delete.component';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-denounce',
  templateUrl: './denounce.component.html',
  styleUrls: ['./denounce.component.css']
})
export class DenounceComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('anuncio', { static: true }) anuncio: ElementRef;
  dataSource;

  tableColumns: string[] = ['select', 'DenunciaId', 'Anuncio','Codigo', 'Usuario', 'Motivo', 'FechaCreacion', 'Estado', 'Acciones']; // Acciones
  selection = new SelectionModel<Denuncia>(true, []);
  estado = '';
  currentUser: Usuario;

  constructor(public service: DenunciaService, private router: Router, public dialog: MatDialog,
    private actRoute: ActivatedRoute,private servConfiguracion: ConfiguracionesService,
    public toastr: ToastrService,private loading: LoadingIndicatorService) {
    // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  // constructor(public service: DenunciaService, private router: Router, private actRoute: ActivatedRoute
  //   , public authenticationService: AuthenticationService, public toastr: ToastrService) {
  //   this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  // }

  ngOnInit() {
    this.dataSource = new DenunciasDsService(this.service, this.loading);
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.service.pageIndex-1;
  this.paginator.pageSize=this.service.pageSize;
    this.dataSource.loadCDenuncia('Anuncio', '', '', '', 'asc', this.service.pageIndex, this.service.pageSize);
  }

  onEdit(id) {
    this.router.navigate(['edit', +id], {relativeTo: this.actRoute});
  }


  onDelete(id) {

    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '285px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(Boolean(JSON.parse(result)))
      {
        this.service.deleteDenuncia(id, this.dataSource);
      }
    });
    // if (confirm('Seguro desea eliminar este elemento?')) {
    //   this.service.deleteDenuncia(id, this.dataSource);
    //
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
  checkboxLabel(row?: Denuncia): string {
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
            console.log(this.dataSource.data.findIndex(d => d === item));
            this.dataSource.data.splice(index, 1);
            this.service.deleteDenuncia(item.DenunciaId, this.dataSource); // eliminar transferenecia
          });
          this.toastr.success('Se han eliminado las denuncias correctamente', 'Denuncia');
          this.selection = new SelectionModel<Denuncia>(true, []);
        }
      });
       }
        else {
          this.toastr.error('Se debe selecionar un elemento de la lista', 'Denuncias');
        }

  }
  // *********************Seleccionar y eliminar una o varias filas***************************************

  ngAfterViewInit(): void {
    // server-side search
    if (this.input !== undefined) {
      fromEvent(this.input.nativeElement, 'change')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex=1;
          this.loadDenunciasPage();
        })
      )
      .subscribe();
    }

    if (this.anuncio !== undefined) {
      fromEvent(this.anuncio.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex=1;
          this.loadDenunciasPage();
        })
      )
      .subscribe();
    }

    // reset the paginator after sorting
    // if (this.sort !== undefined) {
    //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDenunciasPage())
      )
      .subscribe();
    // }
  }


  filterEstado(estadoSelected) {
    this.estado = estadoSelected;
    this.paginator.pageIndex = 0;
  this.service.pageIndex=1;
    this.loadDenunciasPage();
  }

  loadDenunciasPage() {
    this.dataSource.loadCDenuncia(
      this.sort.active,
      this.estado,
      this.input.nativeElement.value,
      this.anuncio.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize);
  }
moreDetails(id) {
  //let urlRoute = this.router.createUrlTree(['detalles-anuncio/', id]).toString();
  let urlRoute = this.servConfiguracion.getUrlRootSite()+'detalles-anuncio/'+id;
  window.open(urlRoute, '_blank');

  // this.router.navigate(['detalles-anuncio', +id]);
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
this.paginator.page.unsubscribe();
  }

}
