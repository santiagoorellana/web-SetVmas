import {AfterViewInit, Component, ElementRef, Injectable, OnInit, ViewChild, Inject, OnDestroy} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator} from '@angular/material/paginator';
import { AnunciosService } from '../../../services/advert/anuncios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { ListarAnunciosServiceDataSource } from '../../../services/advert/listar-anuncios.service-ds';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EditarAnunciosComponent } from '../../common/modals/advert/editar-anuncios/editar-anuncios.component';
import { Overlay } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ConfiguracionesService } from '../../../services/configuration/configuration.service';
import { AnunciosModel } from '../../../models/anuncios.model';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import {DeleteComponent} from '../../common/modals/delete/delete.component';
import {Transferencia} from '../../../models/transferencia.model';
// import { ReportAnunceComponent } from '../../common/report-anunce/report-anunce.component';
import { PageEvent } from '@angular/material/paginator';
import {CategoryService} from "../../../services/category/category.service";
import {TipoOpcionModel} from "../../../models/tipo-opcion.model";
import {Categoria} from "../../../models/categoria.model";
import {TipoOpcionService} from "../../../services/type-option/tipo-opcion.service";
import {MatSelect, MatSelectChange} from "@angular/material/select";



// const initialSelection = [];
// const allowMultiSelect = true;
// this.selection = new SelectionModel<AnunciosModel>(allowMultiSelect, initialSelection);

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.css']
})
export class AdvertComponent implements OnInit {

  selection = new SelectionModel<AnunciosModel>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;
  tipocion = 0;
  categoria = 0;

  @ViewChild('rol', { static: true }) rol: ElementRef;
  dataSource ;
  tableColumns: string[] = ['select', 'AnuncioId', 'ProductoNuevo', 'Precio', 'Titulo', 'FechaCreacion', 'FechaModificacion',
  'Codigo', 'NombreContacto', 'Provincia', 'Municipio', 'ContadorView', 'IsActivo', 'IsVisible'/*,  'Acciones'*/];
  listaRoles: string[] = [];
  rolSelected: string = '';
  listaCat: Categoria[] = [];
  listaAutoRen: TipoOpcionModel[] = [];


  constructor(public servAnu: AnunciosService, private router: Router, private actRoute: ActivatedRoute,private loading:LoadingIndicatorService,
    public dialog: MatDialog, private overlay: Overlay, @Inject(DOCUMENT) private document: Document,
    private servConfig: ConfiguracionesService, public toastr: ToastrService, private servConfiguracion: ConfiguracionesService,
              private servCategoria: CategoryService, private servTipOpci: TipoOpcionService) {
    this.listaRoles = this.servConfig.getRoles();
    this.servCategoria.getCategoriasAll('Nombre', '', 'asc', 1, 5000)
      .then(res => {
        this.listaCat = res as Categoria[];
        this.listaCat.push(new Categoria(0,  'Ninguna', null, '', '', 0));

      });
    this.servTipOpci.getTipoOpcionsAllAdminAnu('NombreCodigo', 'AUTO_', 'asc', 1, 5000)
      .then(res => {
        this.listaAutoRen = res as TipoOpcionModel[];
        this.listaAutoRen.push(new TipoOpcionModel(0,  'Ninguna', null, '', 0, 0, 0));

      });



  }

  ngOnInit() {
    this.dataSource = new ListarAnunciosServiceDataSource(this.servAnu, this.loading);
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.servAnu.pageIndex-1;
  this.paginator.pageSize=this.servAnu.pageSize;
    this.dataSource.loadAnuncios('FechaCreacion', '', '', '', '', 'desc', this.servAnu.pageIndex, this.servAnu.pageSize);
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
  checkboxLabel(row?: AnunciosModel): string {
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
          this.servAnu.deleteAnuncios(item.AnuncioId, this.dataSource); // eliminar usuario

        });
        this.selection = new SelectionModel<AnunciosModel>(true, []);
        this.toastr.success('Se han eliminado los anuncios correctamente.', 'Anuncio');
      }
    });

  }
  else
    this.toastr.error('Se debe selecionar un elemento de la lista.', 'Anuncio');



    // if (this.selection.selected.length > 0) {
    //   this.selection.selected.forEach(item => {
    //     if (confirm('Seguro desea eliminar los elementos seleccionados?')) {
    //       const index: number = this.dataSource.data.findIndex(d => d === item);
    //       this.dataSource.data.splice(index, 1);
    //       this.servAnu.deleteAnuncios(item.AnuncioId, this.dataSource); // eliminar usuario
    //       this.toastr.success('Se han eliminado los anuncios correctamente.', 'Anuncio');
    //     }
    //   });
    //   this.selection = new SelectionModel<AnunciosModel>(true, []);
    // } else {
    //   this.toastr.error('Se debe selecionar un elemento de la lista.', 'Anuncio');
    // }

  }
  // *********************Seleccionar y eliminar una o varias filas***************************************


  ocultar() {
    if (this.selection.selected.length > 0) {
      if (confirm('¿Seguro desea confirmar los elementos seleccionados?')) {
        this.selection.selected.forEach(item => {
          const index: number = this.dataSource.data.findIndex(d => d === item);
          this.dataSource.data.splice(index, 1);
          this.servAnu.ocultarMostrarAnuncioV3(item.AnuncioId, this.dataSource);
        });
        this.selection = new SelectionModel<AnunciosModel>(true, []);
        this.toastr.success('Se han modificado los anuncios seleccioandos.', 'Anuncio');
      }
    } else {
      this.toastr.error('Se debe selecionar un elemento de la lista.', 'Anuncio');
    }
  }



  onEdit(id) {
    // this.router.navigate(['/listaranuncios/mostraranuncio', 1/*+id*/], {relativeTo: this.actRoute});
    // let dialogRef = this.dialog.open(CustomerGarageAddEditComponent, {
    //  maxWidth: '100vw',
    //  maxHeight: '100vh',
    //  height: '100%',
    //  width: '100%'
    // });

   // this.router.navigate(['/listaranuncios/gestionaranuncio'], {relativeTo: this.actRoute});
  }
  onDelete(id) {


    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '285px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(Boolean(JSON.parse(result)))
      {
        this.servAnu.deleteAnuncios(id, this.dataSource);
      }
    });

    // if (confirm('Seguro desea eliminar este elemento?')) {
    //   this.servAnu.deleteAnuncios(id, this.dataSource);
    //
    // }
  }

  filterRol(rol) {

    this.rolSelected = rol;
    this.paginator.pageIndex = 0;
  this.servAnu.pageIndex=1;
    //this.loadUsariosPageByPuntosPage();
    this.loadAnunciosPage();
  }
  onRowClicked(row) {
    // this.router.navigate(['/listaranuncios/mostraranuncio', + row.AnuncioId ], {relativeTo: this.actRoute});
    this.servAnu.verAnuncio.next(row);
    this.servAnu.idAnuncio.next(row.AnuncioId);
    // const dialogRef = this.dialog.open(ReportAnunceComponent, {
    //   width: '900px',
    //   height: '620px',
    // });

    this.document.body.classList.add('noscroll');

    // dialogRef.afterClosed().subscribe(result => {
    //   this.document.body.classList.remove('noscroll');
    //   this.servAnu.idAnuncio.next(0);
    // });

  //let urlRoute = this.router.createUrlTree(['detalles-anuncio/', id]).toString();
  let urlRoute = this.servConfiguracion.getUrlRootSite()+'detalles-anuncio/'+row.AnuncioId;
  window.open(urlRoute, '_blank');

  }
  ngAfterViewInit(): void {
    if (this.input !== undefined) {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.servAnu.pageIndex=1;
          this.loadAnunciosPage();
        })
      )
      .subscribe();
    }

    // if (this.inactividad !== undefined) {
    // fromEvent(this.inactividad.nativeElement, 'click')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       //this.loadUsariosPageByInactividadPage();
    //       this.paginator.pageIndex = 0;
    //       this.servAnu.pageIndex=1;
    //       this.loadAnunciosPage();
    //
    //     })
    //   )
    //   .subscribe();
    // }

    // if (this.renovacion !== undefined) {
    // fromEvent(this.renovacion.nativeElement, 'click')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       //this.loadUsariosPageByInactividadPage();
    //       this.paginator.pageIndex = 0;
    //       this.servAnu.pageIndex=1;
    //       this.loadAnunciosPage();
    //
    //     })
    //   )
    //   .subscribe();
    // }

    /*if (this.rol !== undefined) {
    fromEvent(this.rol.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          // this.loadUsariosPageByRolPage();
          this.paginator.pageIndex = 0;
          this.servAnu.pageIndex=1;
          this.loadAnunciosPage();
        })
      )
      .subscribe();
    }*/
      ////**************************Filtro para buscar por rol y dias de inactividad*********************************


    // reset the paginator after sorting
    if (this.sort !== undefined) {
     // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadAnunciosPage())
      )
      .subscribe();
    }
  }

  loadAnunciosPage() {

    this.dataSource.loadAnuncios(
      this.sort.active,
      this.input.nativeElement.value,
      this.rolSelected,
      this.tipocion,
      this.categoria,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize);
  }
  filter() {


    this.loadAnunciosPage();
  }


getPaginatorData(event:PageEvent)
{
  this.servAnu.pageIndex=event.pageIndex+1;
  if(this.servAnu.pageSize != event.pageSize)
  {
    this.servAnu.pageSize=event.pageSize;
    this.servAnu.pageIndex=1;
    this.paginator.pageIndex=this.servAnu.pageIndex-1;
    this.paginator.pageSize=this.servAnu.pageSize;

  }

}

  ngOnDestroy(): void {
  if (this.sort !== undefined)
{
  this.sort.sortChange.unsubscribe();
  this.paginator.page.unsubscribe();
}
}


}
