import {Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import { VariableConfiguracion } from '../../../models/variable-configuracion.model';
import { VariableConfiguracionService } from '../../../services/variable/variable-configuracion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { VariableConfiguracionDsService } from '../../../services/variable/variable-configuracion-ds.service';
import { debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Usuario } from '../../../models/usuario.model';
import { VariableConfiguracionPuntosDsService } from '../../../services/variable/variable-configuracion-puntos-ds.service';
import { VariableConfiguracionPagoDsService } from '../../../services/variable/variable-configuracion-pago-ds.service';
import { VariableConfiguracionBonificacionDsService } from '../../../services/variable/variable-configuracion-bonificacion-ds.service';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-configuration-variables',
  templateUrl: './configuration-variables.component.html',
  styleUrls: ['./configuration-variables.component.css']
})
export class ConfigurationVariablesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('paginatorGeneral', { static: true }) paginatorGeneral: MatPaginator;
  @ViewChild('paginatorPuntos', { static: true }) paginatorPuntos: MatPaginator;
  @ViewChild('paginatorBoni', { static: true }) paginatorBoni: MatPaginator;
  @ViewChild('paginatorPagos', { static: true }) paginatorPagos: MatPaginator;
  @ViewChild('sortGeneral', { static: true }) sortGeneral: MatSort;
  @ViewChild('sortPuntos', { static: true }) sortPuntos: MatSort;
  @ViewChild('sortPagos', { static: true }) sortPagos: MatSort;
  @ViewChild('sortBoni', { static: true }) sortBoni: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;
  dataSource;
  dataSourcePuntos;
  dataSourcePagos;
  dataSourceBoni;

  currentUser: Usuario;
// 'Bonificación',
  tabs: string[] = ['General', 'Puntos', 'Formas de Pago'];
  selectedTab = this.tabs[0];
  selectedIndex = 0;


  constructor(public service: VariableConfiguracionService, public router: Router,
              public actRoute: ActivatedRoute,private loading: LoadingIndicatorService) {
  }

  // constructor(public service: VariableConfiguracionService, public router: Router,
  //   public actRoute: ActivatedRoute, private authenticationService: AuthenticationService) {
  //   this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  // }

  ngOnInit() {
    this.dataSource = new VariableConfiguracionDsService(this.service, this.loading);
    this.dataSourcePuntos = new VariableConfiguracionPuntosDsService(this.service, this.loading);
    this.dataSourcePagos = new VariableConfiguracionPagoDsService(this.service, this.loading);
    this.dataSourceBoni = new VariableConfiguracionBonificacionDsService(this.service, this.loading);

    this.dataSource.paginator = this.paginatorGeneral;
    this.dataSource.sort = this.sortGeneral;

    this.dataSourcePuntos.paginator = this.paginatorPuntos;
    this.dataSourcePuntos.sort = this.sortPuntos;

    this.dataSourceBoni.paginator = this.paginatorBoni;
    this.dataSourceBoni.sort = this.sortBoni;

    this.dataSourcePagos.paginator = this.paginatorPagos;
    this.dataSourcePagos.sort = this.sortPagos;


   /*this.dataSourceBoni.loadCVariableByBonificacion('Nombre', '', 'asc', 1, 10);
    this.selectedTab = this.tabs[2];
    this.selectedIndex = 2;*/

  this.dataSource.paginator.pageIndex=this.service.pageIndex-1;
  this.dataSource.paginator.pageSize=this.service.pageSize;


  this.dataSource.loadCVariable('Nombre', '', 'asc', this.service.pageIndex, this.service.pageSize);
    this.selectedTab = this.tabs[0];
    this.selectedIndex = 0;

    // if (this.currentUser.Rol == "Director") {

    //   this.dataSourceBoni.loadCVariableByBonificacion('Nombre', '', 'asc', 1, 10);
    //   this.selectedTab = this.tabs[2];
    //   this.selectedIndex = 2;
    // }
    // else {
    //   this.dataSource.loadCVariable('Nombre', '', 'asc', 1, 10);
    //   this.selectedTab = this.tabs[0];
    //   this.selectedIndex = 0;
    // }
  }

  applyFilter(filterValue: string) { // filtrar por tab
    this.service.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(id) {
    this.router.navigate(['add', +id], { relativeTo: this.actRoute });
  }
  onDelete(id) {
    this.service.deleteVariableConfiguracion(id);

  }

  onLinkClick(event: MatTabChangeEvent) {

  this.service.pageIndex = 1;
    if (event.index === 0) {
      this.paginatorGeneral.pageIndex = 0;
      this.dataSource.loadCVariable('Nombre', '', 'asc', this.service.pageIndex, this.service.pageSize);
      this.selectedTab = this.tabs[0];

    } else if (event.index === 1) {
      this.paginatorPuntos.pageIndex = 0;
      this.dataSourcePuntos.loadCVariableByPuntos('Nombre', '', 'asc',this.service.pageIndex, this.service.pageSize);
      this.selectedTab = this.tabs[1];

    } else if (event.index === 2) {
      this.paginatorBoni.pageIndex = 0;

      this.dataSourceBoni.loadCVariableByBonificacion('Nombre', '', 'asc',this.service.pageIndex, this.service.pageSize);
      this.selectedTab = this.tabs[2];

    } else {
      this.paginatorPagos.pageIndex = 0;

      this.dataSourcePagos.loadCVariableByPagos('Nombre', '', 'asc', this.service.pageIndex, this.service.pageSize);
      this.selectedTab = this.tabs[3];
    }
    this.selectedIndex = event.index;
  }

  // ****************Filtro************************


  ngAfterViewInit(): void {
    // server-side search
    if (this.input !== undefined) {
      fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.service.pageIndex = 1;
          if (this.selectedTab === 'General') {
            this.paginatorGeneral.pageIndex = 0;
            this.loadVariablePage();
          }
          else if (this.selectedTab === 'Puntos') {
            this.loadVariableByPuntosPage();
            this.paginatorPuntos.pageIndex = 0;
          }
         /* else if (this.selectedTab === 'Bonificación') {
            this.loadVariableByBonificacionPage();
            this.paginatorBoni.pageIndex = 0;
          }*/
          else {
            this.loadVariableByPagosPage();
            this.paginatorPagos.pageIndex = 0;
          }

        })
      )
      .subscribe();
    }

    if (this.sortGeneral !== undefined) {
    // reset the paginator after sorting
    /*this.sortGeneral.sortChange.subscribe(() => {
      this.paginatorGeneral.pageIndex = 0;
    });*/
    merge(this.sortGeneral.sortChange, this.paginatorGeneral.page)
      .pipe(
        tap(() => {
          this.loadVariablePage();
        })
      )
      .subscribe();
    }

    if (this.sortPuntos !== undefined) {
    // reset the paginator after sorting
   /* this.sortPuntos.sortChange.subscribe(() => {
      this.paginatorPuntos.pageIndex = 0;
    });*/
    merge(this.sortPuntos.sortChange, this.paginatorPuntos.page)
      .pipe(
        tap(() => {
          this.loadVariableByPuntosPage();
        })
      )
      .subscribe();
    }

    if (this.sortBoni !== undefined) {
   /* this.sortBoni.sortChange.subscribe(() => {
      this.paginatorBoni.pageIndex = 0;
    });*/
    merge(this.sortBoni.sortChange, this.paginatorBoni.page)
      .pipe(
        tap(() => {
          this.loadVariableByBonificacionPage();
        })
      )
      .subscribe();
    }

    if (this.sortPagos !== undefined) {
   /* this.sortPagos.sortChange.subscribe(() => {
      this.paginatorPagos.pageIndex = 0;
    });*/
    merge(this.sortPagos.sortChange, this.paginatorPagos.page)
      .pipe(
        tap(() => {
          this.loadVariableByPagosPage();
        })
      )
      .subscribe();
    }
  }


  loadVariablePage() {
    this.dataSource.loadCVariable(
      this.sortGeneral.active,
      this.input.nativeElement.value,
      this.sortGeneral.direction,
      this.paginatorGeneral.pageIndex + 1,
      this.paginatorGeneral.pageSize);
  }

  loadVariableByPuntosPage() {
    this.dataSourcePuntos.loadCVariableByPuntos(
      this.sortPuntos.active,
      this.input.nativeElement.value,
      this.sortPuntos.direction,
      this.paginatorPuntos.pageIndex + 1,
      this.paginatorPuntos.pageSize);
  }

  loadVariableByPagosPage() {
    this.dataSourcePagos.loadCVariableByPagos(
      this.sortPagos.active,
      this.input.nativeElement.value,
      this.sortPagos.direction,
      this.paginatorPagos.pageIndex + 1,
      this.paginatorPagos.pageSize);
  }

  loadVariableByBonificacionPage() {
    this.dataSourceBoni.loadCVariableByBonificacion(
      this.sortBoni.active,
      this.input.nativeElement.value,
      this.sortBoni.direction,
      this.paginatorBoni.pageIndex + 1,
      this.paginatorBoni.pageSize);
  }


getPaginatorData(event:PageEvent)
{
  this.service.pageIndex=event.pageIndex+1;
  if(this.service.pageSize!=event.pageSize)
  {
    this.service.pageSize=event.pageSize;
    this.service.pageIndex=1;
 //   this.paginator.pageIndex=this.service.pageIndex-1;
  //  this.paginator.pageSize=this.service.pageSize;

  }

}


  ngOnDestroy(): void {
    this.sortGeneral.sortChange.unsubscribe();
    this.sortPuntos.sortChange.unsubscribe();
    //this.sortBoni.sortChange.unsubscribe();
   // this.sortPagos.sortChange.unsubscribe();

   this.paginatorGeneral.page.unsubscribe();
   this.paginatorPuntos.page.unsubscribe();
  //this.paginatorBoni.page.unsubscribe();
 //this.paginatorPagos.page.unsubscribe();


  }
}
