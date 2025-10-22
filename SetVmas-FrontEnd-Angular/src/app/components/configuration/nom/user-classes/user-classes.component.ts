import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ClasesUsuariosService } from '../../../../services/class-user/clases-usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ClasesUsuariosServiceDataSource } from '../../../../services/class-user/clases-usuarios.service-ds';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import {LoadingIndicatorService} from '../../../../services/loading/loading-indicator.service';
import { PageEvent } from '@angular/material/paginator';


class Objeto {
  constructor(private policyNumber: string, private creationDate: string, private expireDate: string,
              private policyAmount: string, private clientId: string, private employeeId: string) { }
}
@Component({
  selector: 'app-user-classes',
  templateUrl: './user-classes.component.html',
  styleUrls: ['./user-classes.component.css']
})
export class UserClassesComponent implements OnInit, AfterViewInit, OnDestroy {
  
  value:string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;
  dataSource ;
  tableColumns: string[] = ['ClasesUsuariosId', 'Nombre', 'FactorBonificacionCompra', 'BonificacionPorAlcanzarla',
  'RequisitoAntigueda', 'RequisitoCompras', 'RequisitoCantidadReferidos', 'RequisitoPuntos', 'Acciones'];
  constructor(public servCU: ClasesUsuariosService, private router: Router,private loading: LoadingIndicatorService, private actRoute: ActivatedRoute) { }
//  'BonificacionPorAnuncioDiario', 
  ngOnInit() {
    this.dataSource = new ClasesUsuariosServiceDataSource(this.servCU, this.loading);
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.servCU.pageIndex-1;
  this.paginator.pageSize=this.servCU.pageSize;
    this.dataSource.loadCusuarios('Nombre', '', 'asc',  this.servCU.pageIndex, this.servCU.pageSize);
    this.asignarAlias(this.value);
  }

  onEdit(id) {
    this.router.navigate(['edit', +id], {relativeTo: this.actRoute});
  }

  onDelete(id) {
    if (confirm('Seguro desea eliminar este elemento?')) {
      this.servCU.deleteClasesUsuarios(id, this.dataSource);

    }
  }

  asignarAlias(value:string){
    if(value==='Iniciado')
     {return '1. Iniciado'}
   if(value==='Bronce') {return '2. Bronce'}
    if(value==='Plata') {return '3. Plata'}
    if(value==='Oro') {return '4. Oro'}
    if(value==='Diamante') {return '5. Diamante'}
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
            this.servCU.pageIndex=1;
            this.loadClasesUsariosPage();
          })
        )
        .subscribe();

      // reset the paginator after sorting
   //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadClasesUsariosPage())
        )
        .subscribe();
    }
  }

  loadClasesUsariosPage() {
    this.dataSource.loadCusuarios(
      this.sort.active,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize);
  }
getPaginatorData(event:PageEvent)
{
  this.servCU.pageIndex=event.pageIndex+1;
  if(this.servCU.pageSize!=event.pageSize)
  {
    this.servCU.pageSize=event.pageSize;
    this.servCU.pageIndex=1;
    this.paginator.pageIndex=this.servCU.pageIndex-1;
    this.paginator.pageSize=this.servCU.pageSize;

  }

}
  ngOnDestroy(): void {
    this.sort.sortChange.unsubscribe();
  }
}
