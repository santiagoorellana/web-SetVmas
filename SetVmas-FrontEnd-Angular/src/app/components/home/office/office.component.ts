import {Component, Inject, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {Usuario} from '../../../models/usuario.model';
import {SelectionModel} from '@angular/cdk/collections';
import {ClasesUsuariosModel} from '../../../models/clases-usuarios.model';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import {AnunciosService} from '../../../services/advert/anuncios.service';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import { Overlay } from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {CategoryService} from '../../../services/category/category.service';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';
import {UsuarioService} from '../../../services/user/usuario.service';
import {ClasesUsuariosService} from '../../../services/class-user/clases-usuarios.service';
import {PagosService} from '../../../services/payment/pagos.service';
import {OfficeService} from '../../../services/office/office.service';
import {VariableConfiguracion} from '../../../models/variable-configuracion.model';
import {AnunciosModel} from '../../../models/anuncios.model';
import {MatTableDataSource} from '@angular/material/table';
import {QrCodeComponent} from '../../common/modals/office/qr-code/qr-code.component';
import { SellPointsComponent } from '../../common/modals/office/sell-points/sell-points.component';
import { DirectPurchaseComponent } from '../../common/modals/office/direct-purchase/direct-purchase.component';
import { AssignBonusesComponent } from '../../common/modals/office/assign-bonuses/assign-bonuses.component';
import { TransfersComponent } from '../../common/modals/office/transfers/transfers.component';
import { ClassifyAnunceComponent } from '../../common/modals/office/classify-anunce/classify-anunce.component';
import { ComplaintsComponent } from '../../common/modals/office/complaints/complaints.component';
import {EditarAnunciosComponent} from '../../common/modals/advert/editar-anuncios/editar-anuncios.component';
import {DeleteComponent} from '../../common/modals/delete/delete.component';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {AdvertService} from '../../../services/office/advert.service';
import {ReferredDsService} from '../../../services/office/referred-ds.service';
import { merge } from 'rxjs/internal/observable/merge';
import { debounceTime, distinctUntilChanged, tap, takeUntil} from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {EmailConfirmComponent} from "../../common/modals/home/email-confirm/email-confirm.component";
import {ModalLoginComponent} from "../../common/modals/home/login/login.component";
import {ModalRegisterComponent} from "../../common/modals/home/register/register.component";
import { Title, Meta } from '@angular/platform-browser';
import {Router} from "@angular/router";


@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']
})
export class OfficeComponent implements OnInit, OnDestroy {

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
@ViewChild('paginatorAnuncios', { static: true }) paginatorAnuncios: MatPaginator; // paginado
@ViewChild('sortAnuncios', { static: true }) sortAnuncios: MatSort;

@ViewChild('paginatorReferidos', { static: true }) paginatorReferidos: MatPaginator; // paginado
@ViewChild('sortReferidos', { static: true }) sortReferidos: MatSort;


public finalize = new Subject();

  currentUser: Usuario;
  anfitrionUser: Usuario;
  cantReferidos;
  cantAnuncios;


  dataSource;



  // Tables
  anunces: any[] = [];

  referrals: any[] = [];

  tableColumns: string[] = ['Correo', 'Codigo', /* 'Email',*/ 'Telefono', 'CantReferidos'];
  tableColumns2: string[] = [/*'select',*/ 'Titulo', 'Tipo', 'options'];

  selection = new SelectionModel<any>(true, []);
  dataSource2;
  mensaje;
  volumenCompra;
  clases: ClasesUsuariosModel[] = [];

pageIndex=1;
pageSize=10;

 deshabilitarDatosRegT = true;
  deshabilitarDatosRegP = true;
  deshabilitarDatosRegC = true;
  deshabilitarDatosCorreo = true;

  hide = true;

  constructor( public authenticationService: AuthenticationService,
               private servAnuncio: AnunciosService, public dialog: MatDialog, private overlay: Overlay,
               @Inject(DOCUMENT) private document: Document, private servCategoria: CategoryService,
               private servCo: ConfiguracionesService, private servOff: OfficeService, private toastr: ToastrService,
               private servUsuario: UsuarioService, private servClass: ClasesUsuariosService, private servPagos: PagosService,
               private loadingIndicator: LoadingIndicatorService,
               public titleService: Title,
               public metaService: Meta,  private router: Router) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });

    this.anfitrionUser = new Usuario();
  }

  ngOnInit(): void {

    this.titleService.setTitle('Oficina Virtual - Setvmás');
    this.addTags();


    this.servUsuario.getUsuarioByCodigoV2(this.currentUser.Anfitrion).then(res => {
      this.anfitrionUser = res as Usuario;
    });
    this.servUsuario.getUsuarioVolumenCompraByUser(this.currentUser.UsuarioId).then(res => {

      this.volumenCompra = res as number;
    });
    this.servOff.getMensaje().then(res => {
      this.mensaje = (res as VariableConfiguracion).Valor;

    });

   // this.loadingIndicator.showLoading(true);

this.dataSource2 = new AdvertService( this.servOff, this.loadingIndicator);
this.dataSource = new ReferredDsService( this.servOff, this.loadingIndicator);

this.dataSource2.paginator = this.paginatorAnuncios;
this.dataSource2.sort = this.sortAnuncios;
this.dataSource2.paginator.pageIndex=this.pageIndex-1;
this.dataSource2.paginator.pageSize=this.pageSize;

this.dataSource.paginator = this.paginatorReferidos;
this.dataSource.sort = this.sortReferidos;


this.dataSource2.loadAnuncios('FechaModificacion', this.currentUser.UsuarioId, 'desc', this.pageIndex, this.pageSize);
this.dataSource.loadUsuarios('FechaModificacion', this.currentUser.UsuarioId, 'desc', 1, 10);

    Promise.all([
      this.servOff.getCantidadReferidos(this.currentUser.UsuarioId).then(res => this.cantReferidos = res as number),
      this.servOff.getCantidadAnuncios(this.currentUser.UsuarioId).then(res => this.cantAnuncios = res as number)
    ]).then((success)=>{
     // this.loadingIndicator.showLoading(false);
    },(error)=>{
    //  this.loadingIndicator.showLoading(false);
    })


    this.updateCurrentUser();
    this.servClass.getClasesUsuarios('Nombre', '', 'asc', '1', '100').subscribe(res => (this.clases = res as ClasesUsuariosModel[]));
  }

  updateCurrentUser() {
    // var clase = this.currentUser.ClasesUsuarios.ClasesUsuariosId;
    var clase = JSON.parse(JSON.stringify(this.currentUser)).Clase;
    //Zuleidy actualizar el usuario atenticado
    this.authenticationService.getUsuarioById(this.currentUser.UsuarioId).then(res => {
      this.currentUser = res as Usuario;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.authenticationService.currentUserSubject.next(this.currentUser);
      var newClase = JSON.parse(JSON.stringify(this.currentUser)).Clase;
      if (clase != newClase)
        this.toastr.success('Felicidades. Usted ha subido al nivel ' + this.currentUser.ClasesUsuarios.Nombre);
    });
    //Zuleidy actualizar el usuario atenticado
  }


  addTags(){
    this.metaService.addTag( { name: 'author', content: 'Setvmás' });
  }

  clasifiarUsuario(user: Usuario) {
    var clase;
    switch (user.ClasesUsuarios.Nombre) {
      case 'Iniciado':
        clase = this.clases.find(x => x.Nombre == 'Bronce');
        if (user.Puntos >= clase.BonificacionPorAlcanzarla) {
          user.ClasesUsuarios = clase;
        }
        break;
      case 'Bronce':
        clase = this.clases.find(x => x.Nombre == 'Plata');
        if (user.CantReferidos >= clase.RequisitoCantidadReferidos) {
          user.ClasesUsuarios = clase;
        }
        break;
      case 'Plata':
        clase = this.clases.find(x => x.Nombre == 'Oro');
        this.servPagos.getPagoPuntosCount(user.UsuarioId).then(res => {
            if ((res as number) >= clase.RequisitoCompras)
              user.ClasesUsuarios = clase;
          }
        );
        break;
      case 'Oro':
        clase = this.clases.find(x => x.Nombre == 'Diamante')
        var puntosComprados = 0;
        this.servPagos.getPagoPuntosCount(user.UsuarioId).then(res => {
            if ((res as number) >= clase.RequisitoCompras && user.CantReferidos > clase.RequisitoCantidadReferidos && new Date(user.FechaCreacion).getMonth() >= clase.RequisitoAntigueda)
              user.ClasesUsuarios = clase;
          }
        );
        break;
      default:

    }


  }

  copiarEnlace() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
   // selBox.value = this.currentUser.Url;
    selBox.value = 'https://setvmas.com/#/r/'+this.currentUser.Codigo;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  this.toastr.success('Enlace de referido copiado al portapapeles.');

  }

  editarAnuncio(row) {
   // this.servAnuncio.idAnuncio.next(row.AnuncioId);
    this.servAnuncio.verAnuncio.next(row);
    this.openDialog(row);
  }

  eliminarAnuncio(row) {

    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '285px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(Boolean(JSON.parse(result)))
      {
       // this.loadingIndicator.showLoading(true);
        this.servAnuncio.deleteAnunciosV2(row.AnuncioId).then(res => {

            this.toastr.success('Valor eliminado correctamente', 'Oficina Virtual');

          //  this.anunces.splice(this.anunces.indexOf(row), 1);
          //  this.dataSource2 = new MatTableDataSource<any>(this.anunces);
           this.dataSource2.loadAnuncios('FechaModificacion', this.currentUser.UsuarioId, 'desc', this.pageIndex, this.pageSize);
           // this.loadingIndicator.showLoading(false);
          },
          err => {

            this.toastr.error('Error durante la operación', 'Oficina Virtual');
            this.loadingIndicator.showLoading(false);
          }
        );
      }
    });


    // if (confirm('Seguro desea eliminar el anuncio?')) {
    //   this.servAnuncio.deleteAnunciosV2(row.anuncio.AnuncioId).then(res => {
    //
    //       this.toastr.success('Valor eliminado correctamente', 'Oficina Virtual');
    //
    //       this.anunces.splice(this.anunces.indexOf(row), 1);
    //       this.dataSource2 = new MatTableDataSource<any>(this.anunces);
    //     },
    //     err => {
    //
    //       this.toastr.error('Error durante la operación', 'Oficina Virtual');
    //     }
    //   );
    // }
  }

  ocultarAnuncio(row) {
 // this.loadingIndicator.showLoading(true);
    this.servAnuncio.ocultarMostrarAnuncioV2(row.AnuncioId).then(res => {


        //  this.anunces.splice(this.anunces.indexOf(row), 1);
        //  this.dataSource2 = new MatTableDataSource<any>(this.anunces);
        this.dataSource2.loadAnuncios('FechaModificacion', this.currentUser.UsuarioId, 'asc', this.pageIndex, this.pageSize);
    //    this.loadingIndicator.showLoading(false);
      },
          err => {


      //  this.loadingIndicator.showLoading(false);
      }
  );
  }

  insertarAnuncio() {
    /*if (new Date(this.currentUser.FechaUltimoAnuncio).getDate() != new Date().getDate())
      this.openDialog(0);
    else
      this.toastr.error('Solo puede insertar un anuncio por día.', 'Anuncio');*/
    if (!this.currentUser.Bloqueado) {
      this.openDialog(null);
    } else {

        this.toastr.error('Ud no puede anunciar en estos momentos.');

    }
  }

  editarUsuario(opcion) {

    if (this.currentUser.Password.length >= 6) {

      this.servUsuario.putUsuarioV3(this.currentUser).then(
        res => {
          if (opcion === 'T') {
            this.deshabilitarDatosRegT = true;
          }
          if (opcion === 'C') {
            this.deshabilitarDatosRegC = true;
          }
          if (opcion === 'P') {
            this.deshabilitarDatosRegP = true;
          }

          this.toastr.success('Se actualizó correctamente', 'Oficina Virtual');
          this.updateCurrentUser();

        },
        err => {
          this.toastr.error('Error durante la actualización', 'Oficina Virtual');
        }
      );
    } else {
      this.toastr.error('La contraseña debe tener al menos 6 dígitos', 'Oficina Virtual');
    }
  }

  // Open Modal Insert Anuncio
  openDialog(anuncio): void {
  // this.servAnuncio.idAnuncio.next(anuncio);
    const dialogRef = this.dialog.open(EditarAnunciosComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '100% !important',
      panelClass: 'full-screen-modal',
      data: { anuncio : anuncio }
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
      // this.animal = result;
      // this.servAnuncio.idAnuncio.next(0);
      // this.servAnuncio.verAnuncio.next(null);
      this.servAnuncio.insertoAnuncio
          .pipe(takeUntil(this.finalize))
          .subscribe(res => {

        if (res) {

          this.servOff.getCantidadAnuncios(this.currentUser.UsuarioId).then( ress => this.cantAnuncios = ress as number);
          this.dataSource2.loadAnuncios('FechaModificacion', this.currentUser.UsuarioId, 'desc', this.pageIndex, this.pageSize);
          // this.dataSource2 = new MatTableDataSource<any>(this.anunces);
          this.updateCurrentUser();
          this.servAnuncio.insertoAnuncio.next(false);
         // this.toastr.success('Felicidades1. Usted ha subido al nivel ' + this.currentUser.ClasesUsuarios.Nombre);


        }
      });

    /*  this.servAnuncio.insertado$.subscribe(result =>{
        if(result)
        {

        }


      })*/
    });


  }

  // Open Modal Sell Points
  openDialogSellPoints(): void {
    if (!this.currentUser.Bloqueado) {
      const dialogRef = this.dialog.open(SellPointsComponent, {
        width: '360px',
        height: 'auto',
      });
      this.document.body.classList.add('noscroll');
      dialogRef.afterClosed().subscribe(result => {
        this.document.body.classList.remove('noscroll');
        this.updateCurrentUser();
      });


    } else {
      this.toastr.error('Ud no puede Vender en estos momentos.');
    }

  }

  // Open Modal QR
  openDialogQR(): void {
    const codigo = 'https://setvmas.com/#/r/' + this.currentUser.Codigo;
    const dialogRef = this.dialog.open(QrCodeComponent, {
      width: '360px',
      height: 'auto',
      data: {codigo}
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
    });
  }

  // Open Modal AssignBonuses
  openDialogAssignBonuses(): void {
    const dialogRef = this.dialog.open(AssignBonusesComponent, {
      width: '850px',
      // width: '750px',
      height: '600px'
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
    });
  }

  // Open Modal Complaints
  openDialogComplaints(): void {
    const dialogRef = this.dialog.open(ComplaintsComponent, {
      width: '1200px',
      height: '435px',
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
    });
  }
  // Open Modal DirectPurchase
  openDialogDirectPurchase(): void {
    if (!this.currentUser.Bloqueado) {
      const dialogRef = this.dialog.open(DirectPurchaseComponent, {
        width: '850px',
        height: 'auto',
      });

      this.document.body.classList.add('noscroll');

      dialogRef.afterClosed().subscribe(result => {
        this.document.body.classList.remove('noscroll');
        this.updateCurrentUser();
        this.servUsuario.getUsuarioVolumenCompraByUser(this.currentUser.UsuarioId).then(res => {

          this.volumenCompra = res as number;
        });

      });
    } else {
      this.toastr.error('Ud no puede comprar en estos momentos.');
    }
  }

  // Open Modal Transfers
  openDialogTransfers(): void {
    const dialogRef = this.dialog.open(TransfersComponent, {
      width: '900px',
      height: '600px',
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
    });
  }

  // Open Modal Transfers
  openDialogClassifyAnunce(): void {
    const dialogRef = this.dialog.open(ClassifyAnunceComponent, {
      width: '900px',
      height: '620px',
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
    });
  }

  // Open Modal ReportAnunce
  openDialogReportAnunce(): void {
    // const dialogRef = this.dialog.open(ReportAnunceComponent, {
    //   width: '900px',
    //   height: '620px',
    // });
    //
    // this.document.body.classList.add('noscroll');
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   this.document.body.classList.remove('noscroll');
    // });
  }


  /** Para la tabla**/

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource2.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


 ngAfterViewInit (): void {

  // server-side search

  /*fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadAnunciosPage();
      })
  )
      .subscribe();*/

  // reset the paginator after sorting
  this.sortAnuncios.sortChange.subscribe(() => this.paginatorAnuncios.pageIndex = 0);

  merge(this.sortAnuncios.sortChange, this.paginatorAnuncios.page)
      .pipe(
      tap(() => this.loadAnunciosPage())
  ).subscribe();


 // reset the paginator after sorting
  this.sortReferidos.sortChange.subscribe(() => this.paginatorReferidos.pageIndex = 0);

  merge (this.sortReferidos.sortChange, this.paginatorReferidos.page)
    .pipe(
    tap(() => this.loadReferidosPage())
).subscribe();

}

loadAnunciosPage() {
  this.dataSource2.loadAnuncios(
      this.sortAnuncios.active,
      this.currentUser.UsuarioId,
      this.sortAnuncios.direction,
      this.paginatorAnuncios.pageIndex + 1,
      this.paginatorAnuncios.pageSize);
}

loadReferidosPage() {
  this.dataSource.loadUsuarios(
      this.sortReferidos.active,
      this.currentUser.UsuarioId,
      this.sortReferidos.direction,
      this.paginatorReferidos.pageIndex + 1,
      this.paginatorReferidos.pageSize);
}

getPaginatorAdvert(event: PageEvent)
{
  this.pageIndex = event.pageIndex + 1;
  if(this.pageSize !== event.pageSize)
  {
    this.pageSize = event.pageSize;
    this.pageIndex = 1;
    this.dataSource2.paginator.pageIndex = this.pageIndex - 1;
    this.dataSource2.paginator.pageSize = this.pageSize;

  }

}

  habilitarDatosRegistroT() {
    if (!this.deshabilitarDatosRegT) {
      this.editarUsuario('T');
    }
    this.deshabilitarDatosRegT = !this.deshabilitarDatosRegT;

  }
  habilitarDatosRegistroC() {

    this.deshabilitarDatosRegC = !this.deshabilitarDatosRegC;

  }
  habilitarDatosRegistroP() {
    if (!this.deshabilitarDatosRegP) {
      this.editarUsuario('P');
    }
    this.deshabilitarDatosRegP = !this.deshabilitarDatosRegP;

  }

ngOnDestroy(): void {
  this.sortAnuncios.sortChange.unsubscribe();
  this.sortReferidos.sortChange.unsubscribe();

  this.finalize.next();
  this.finalize.complete();
}



  openDialogReAutenticarse(): void {
    // this.servAnuncio.idAnuncio.next(anuncio);

    localStorage.removeItem('reautenticate');
    localStorage.setItem('reautenticate', '1');

    localStorage.removeItem('anfit');
    localStorage.setItem('anfit', this.currentUser.Anfitrion);
    localStorage.removeItem('corr');
    localStorage.setItem('corr', this.currentUser.Correo);
    localStorage.removeItem('pass');
    localStorage.setItem('pass', this.currentUser.Password);
    localStorage.removeItem('tel');
    localStorage.setItem('tel', this.currentUser.Telefono);
    localStorage.removeItem('useraut');
    localStorage.setItem('useraut', this.currentUser.UsuarioId.toString());
    localStorage.removeItem('Reau');
    localStorage.setItem('Reau', '1');


    const dialogRef = this.dialog.open(ModalRegisterComponent, {
   /*   width: '70%',
      height: 'auto',
      maxWidth: '100% !important',
      panelClass: 'full-screen-modal',*/
      data: {  },
      width: '800px',
      height: 'auto',
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
      // this.animal = result;
      // this.servAnuncio.idAnuncio.next(0);
      // this.servAnuncio.verAnuncio.next(null);
      this.servAnuncio.insertoAnuncio
        .pipe(takeUntil(this.finalize))
        .subscribe(res => {

          if (res) {

            this.servOff.getCantidadAnuncios(this.currentUser.UsuarioId).then(res => this.cantAnuncios = res as number);
            this.dataSource2.loadAnuncios('FechaModificacion', this.currentUser.UsuarioId, 'desc', this.pageIndex, this.pageSize);
            // this.dataSource2 = new MatTableDataSource<any>(this.anunces);
            this.updateCurrentUser();
            this.servAnuncio.insertoAnuncio.next(false);
            // this.toastr.success('Felicidades1. Usted ha subido al nivel ' + this.currentUser.ClasesUsuarios.Nombre);


          }
        });

      /*  this.servAnuncio.insertado$.subscribe(result =>{
          if(result)
          {

          }


        })*/
    });


  }


  eliminarSubscripcion(){

    if(confirm("¿Seguro desea cancelar la subscripción?")){
      this.currentUser.Activo = false;
      this.currentUser.Visible = false;
      this.servUsuario.putUsuarioV3(this.currentUser);
      this.authenticationService.logout();
      this.router.navigate(['/']);
    }

  }
}
