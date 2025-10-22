import {AfterContentChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/user/usuario.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Usuario } from '../../../models/usuario.model';
import {UsuarioServiceDataSource} from '../../../services/user/usuario.service-ds';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {merge} from 'rxjs/internal/observable/merge';
import { ClasesUsuariosService } from '../../../services/class-user/clases-usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionesService } from '../../../services/configuration/configuration.service';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import {DeleteComponent} from '../../common/modals/delete/delete.component';
import {MatDialog} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {

  selection = new SelectionModel<Usuario>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('correo', { static: true }) correo: ElementRef;
  @ViewChild('codigo', { static: true }) codigo: ElementRef;
  @ViewChild('inactividad', { static: true }) inactividad: ElementRef;
  @ViewChild('rol', { static: true }) rol: ElementRef;
  @ViewChild('clase', { static: true }) clase: ElementRef;
  @ViewChild('fecha', { static: true }) fecha: ElementRef;
  @ViewChild('puntos', { static: true }) puntos: ElementRef;
  dataSource;

  claseUsuario: string='';
  rolSelected: string='';
  listaRoles: string[] = [];

  currentUser: Usuario;
  constructor(public service: UsuarioService, public router: Router, public actRoute: ActivatedRoute,public dialog: MatDialog,
              public servClase: ClasesUsuariosService, public toastr: ToastrService, private loading:LoadingIndicatorService,
    private servConfig: ConfiguracionesService,private authenticationService: AuthenticationService) {
    this.listaRoles = this.servConfig.getRoles();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.dataSource = new UsuarioServiceDataSource(this.service, this.loading);
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.service.pageIndex-1;
  this.paginator.pageSize=this.service.pageSize;

  this.servClase.getClaseList();
  this.dataSource.loadUsuarios('FechaCreacion', '', '', '', '', '', '', 'asc', this.service.pageIndex, this.service.pageSize, '');
  }

  onEdit(id) {
     this.router.navigate(['add', +id], { relativeTo: this.actRoute });
  }
  onDelete(id) {
    if (confirm('Seguro desea eliminar el elemento seleccionado?')) {
      this.service.deleteUsuarios(id, this.dataSource);
    }
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
  checkboxLabel(row?: Usuario): string {
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
          this.service.deleteUsuarios(item.UsuarioId, this.dataSource); // eliminar usuario

        });
        this.selection = new SelectionModel<Usuario>(true, []);
        this.toastr.success('Se han eliminado los usuarios correctamente.', 'Usuarios')
      }
    });

  }
  else
    this.toastr.error('Se debe selecionar un elemento de la lista.', 'Usuarios');


}
  // *********************Seleccionar y eliminar una o varias filas***************************************

  // ****************Filtro************************
  applyFilter(filterValue: string) {
    this.service.dataSource.filter = filterValue.trim().toLowerCase();
  }
    // ****************Filtro************************
  ngAfterViewInit(): void {

    // server-side search
    if (this.correo !== undefined) {
      fromEvent(this.correo.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex = 1;
          this.loadUsuariosPage();
        })
      )
      .subscribe();
    }

    ////************************** Filtro para buscar por rol y dias de inactividad********************************

    if (this.codigo !== undefined) {
      fromEvent(this.codigo.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex = 1;
          this.loadUsuariosPage();
        })
      )
      .subscribe();
    }


    ////**************************Filtro para buscar por rol y dias de inactividad*********************************
    if (this.inactividad !== undefined) {
    fromEvent(this.inactividad.nativeElement, 'change')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex = 1;
          //this.loadUsariosPageByInactividadPage();
          this.loadUsuariosPage();

        })
      )
      .subscribe();
    }

    if (this.inactividad !== undefined) {
    fromEvent(this.rol.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex = 1;
         // this.loadUsariosPageByRolPage();
          this.loadUsuariosPage();
        })
      )
      .subscribe();
    }
      ////**************************Filtro para buscar por rol y dias de inactividad*********************************


      ////**************************Filtro para buscar por rfecha, clase y puntos *********************************
    if (this.inactividad !== undefined) {
      fromEvent(this.clase.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex = 1;
          ////this.loadUsariosPageByClasePage();
          this.loadUsuariosPage();

        })
      )
      .subscribe();
      }

    if (this.inactividad !== undefined) {
    fromEvent(this.fecha.nativeElement, 'change')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex = 1;
          this.loadUsuariosPage();
        })
      )
      .subscribe();
    }

    if (this.inactividad !== undefined) {
    fromEvent(this.puntos.nativeElement, 'change')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex = 1;
          //this.loadUsariosPageByPuntosPage();
          this.loadUsuariosPage();
        })
      )
      .subscribe();
    }


      ////**************************Filtro para buscar por rfecha, clase y puntos *********************************

    // reset the paginator after sorting
      if (this.sort !== undefined) {
    //  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadUsuariosPage())
        )
        .subscribe();
    }
  }


  filterClase(clase) {
    if (clase === 0) {
      this.claseUsuario = '';
    }
    else
      this.claseUsuario = clase;


    this.paginator.pageIndex = 0;
  this.service.pageIndex = 1;
    //this.loadUsariosPageByPuntosPage();
    this.loadUsuariosPage();
  }



  filterRol(rol) {

    this.rolSelected = rol;
    this.paginator.pageIndex = 0;
  this.service.pageIndex = 1;
    //this.loadUsariosPageByPuntosPage();
    this.loadUsuariosPage();
  }



  loadUsuariosPage() {
    this.dataSource.loadUsuarios(
      this.sort.active,
      this.rolSelected,
      this.correo.nativeElement.value,
   /*   this.codigo.nativeElement.value,*/
      this.claseUsuario,
      this.puntos.nativeElement.value,
      this.inactividad.nativeElement.value,
      this.fecha.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.codigo.nativeElement.value);
  }

  IsActivo(Activo) {
    if (Activo == true)
      return "Si";
    else
      return "No";

  }
  IsBloqueado(Bloqueado) {
    if (Bloqueado == true)
      return "Si";
    else
      return "No";

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
    if (this.sort !== undefined) {
      this.sort.sortChange.unsubscribe();
    }
  }

}
