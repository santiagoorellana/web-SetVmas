import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { MatPaginator, MatSort, MatSelectChange } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { PagosService } from '../../../services/payment/pagos.service';
import { Pago } from '../../../models/pago.model';
import { PagosDsService } from '../../../services/payment/pagos-ds.service';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionesService } from '../../../services/configuration/configuration.service';
import { config } from 'rxjs';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import {MatDialog} from '@angular/material/dialog';
import {DeleteComponent} from '../../common/modals/delete/delete.component';
import { PageEvent } from '@angular/material/paginator';
import { Usuario } from 'src/app/models/usuario.model';
import { ItemSlide } from 'src/app/models/itemSlide.model';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import {UsuarioService} from "../../../services/user/usuario.service";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChild('estado', { static: true }) estado: MatSelectChange;
  dataSource;
  tableColumns: string[] = ['select', 'PagoId', 'TransferenciaId', 'Tipo', 'Fuente','CantCup', 'Fecha', 'Estado', 'Usuario'];/*, 'Acciones'*/
  selection = new SelectionModel<Pago>(true, []);
  estado = '';
  listEstados: string[];
  confirmar = false;
  currentUser: Usuario; // login
  userPago:string;

  constructor(public service: PagosService,public dialog: MatDialog,  private router: Router, private actRoute: ActivatedRoute,
    public toastr: ToastrService, private servConf: ConfiguracionesService,private loading: LoadingIndicatorService,public authenticationService:AuthenticationService,
              public servUser: UsuarioService) {
    this.listEstados = this.servConf.getEstadosPagos();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.dataSource = new PagosDsService(this.service, this.loading);
    // If the user changes the sort order, reset back to the first page.
    this.paginator.pageIndex=this.service.pageIndex-1;
    this.paginator.pageSize=this.service.pageSize;
    //this.usuarioLogueado=this.authenticationService.currentUser;

    this.dataSource.loadCPago('Fecha', '', 'desc', this.service.pageIndex, this.service.pageSize);
    this.service.listaPagos = this.dataSource;
  }


  onEdit(id) {
    this.router.navigate(['edit', +id], { relativeTo: this.actRoute });
  }

  onDelete(id) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '285px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(Boolean(JSON.parse(result)))
      {
        this.service.deletePagos(id,this.dataSource);
      }
    });
    // if (confirm('Seguro desea eliminar este elemento?')) {
    //   this.service.deletePagos(id,this.dataSource);
    // }
  }


  isActivo(estado) {
    if (estado == "No Confirmado") {
      return true;
    }
    else {
      return false;
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
  checkboxLabel(row?: Pago): string {
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
            this.service.deletePagos(item.PagoId, this.dataSource); // eliminar pagos

          });
          this.selection = new SelectionModel<Pago>(true, []);
          this.toastr.success('Se han eliminado los pagos correctamente', 'Pagos');
        }
      });
      // if (confirm('¿Seguro desea eliminar los elementos seleccionados?')) {
      //   this.selection.selected.forEach(item => {
      //     const index: number = this.dataSource.data.findIndex(d => d === item);
      //     this.dataSource.data.splice(index, 1);
      //     this.service.deletePagos(item.PagoId, this.dataSource); // eliminar pagos
      //
      //   });
      //   this.selection = new SelectionModel<Pago>(true, []);
      //   this.toastr.success('Se han eliminado los pagos correctamente', 'Pagos');
      // }
    }
    else
        this.toastr.error('Se debe selecionar un elemento de la lista', 'Pagos');
    }



  confirmarCompra() {

    this.confirmar = true;
    if (this.selection.selected.length > 0) {

      this.selection.selected.forEach(item => {
        const index: number = this.dataSource.data.findIndex(d => d === item);
        this.dataSource.data.splice(index, 1);
        this.userPago = item.Usuario.toString();

        if (item.Estado == "No Confirmado" && this.userPago===this.currentUser.Correo && this.currentUser.Correo!=='info@setvmas.com'){
           this.confirmar = false;

         }


         if (item.Estado == "Confirmado") {
          this.confirmar = false;
          return;
        }
      });

      const listaPagos: number[] = [];

      if (this.confirmar == true)
      {
        if (confirm('¿Seguro desea confirmar los elementos seleccionados?')) {
          this.selection.selected.forEach(item => {
            const index: number = this.dataSource.data.findIndex(d => d === item);
            this.dataSource.data.splice(index, 1);
            if (item.Estado == "No Confirmado") {
              listaPagos.push(item.PagoId);
              //this.service.confirmarCompra(item.PagoId, this.dataSource);
            }
          });
          console.log(listaPagos);
          this.service.confirmarCompra(listaPagos, this.dataSource)
          this.selection = new SelectionModel<Pago>(true, []);
          this.toastr.success('Se han confirmado los pagos correctamente.', 'Pagos');
        }
      }
      else
          {
            if (this.userPago===this.currentUser.Correo && this.currentUser.Correo!=='info@setvmas.com'){
              this.toastr.error('Usted no puede confirmar sus propias compras', 'Pagos');
            }else
        this.toastr.error('Se deben seleccionar solo los pagos no confirmados.', 'Pagos');
          }
      }
      else
        this.toastr.error('Se debe seleccionar un pago de la lista de pagos', 'Pagos');

  }
  // *********************Seleccionar y eliminar una o varias filas***************************************

  // ****************Filtro************************
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // ****************Filtro************************


  ngAfterViewInit(): void {


    // server-side search
    //fromEvent(this.input.nativeElement, 'keyup')
    //  .pipe(
    //    debounceTime(150),
    //    distinctUntilChanged(),
    //    tap(() => {
    //      this.paginator.pageIndex = 0;
    //      this.loadPagosPage();
    //    })
    //  )
    //  .subscribe();

    // reset the paginator after sorting
  //  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadPagosPage())
      )
      .subscribe();
  }

  filterEstado(estadoSelected) {
    this.estado = estadoSelected;
    this.paginator.pageIndex = 0;
    this.service.pageIndex = 1;
    this.loadPagosPage();
  }

  loadPagosPage() {
    this.dataSource.loadCPago(
      this.sort.active,
      this.estado,
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
    this.paginator.page.unsubscribe();
  }
  salvar(Pago:Pago) {
      this.servUser.getUsuarioByCorreo(Pago.Usuario).then(res => {
       const temp = Pago.Usuario;
      Pago.Usuario = res as Usuario;

      this.service.formData = Pago;
      this.service.putPagos(false);
        this.service.formData.Usuario = temp;
      });

  }

}
