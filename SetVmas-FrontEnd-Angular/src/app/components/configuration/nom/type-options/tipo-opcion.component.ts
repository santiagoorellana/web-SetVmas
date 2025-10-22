import {AfterViewInit, Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { merge, fromEvent } from 'rxjs/';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {TipoOpcionService} from '../../../../services/type-option/tipo-opcion.service';
import {TipoOpcionDataSource} from '../../../../services/type-option/tipo-opcion-ds.service';
import {LoadingIndicatorService} from '../../../../services/loading/loading-indicator.service';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-tipo-opcion',
  templateUrl: './tipo-opcion.component.html',
  styleUrls: ['./tipo-opcion.component.css']
})
export class TipoOpcionComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;
  constructor(public servTO: TipoOpcionService, private router: Router,private loading: LoadingIndicatorService, private actRoute: ActivatedRoute) { }

  dataSource ;
  tableColumns: string[] = ['TipoOpcionId', 'Nombre', 'TextoLabel', 'Precio', 'CantidadFrecuencia', 'MinimoComprar', 'Acciones'];

  ngOnInit() {
    // this.course = this.route.snapshot.data["course"];
    this.dataSource = new TipoOpcionDataSource(this.servTO, this.loading);
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.servTO.pageIndex-1;
  this.paginator.pageSize=this.servTO.pageSize;

  this.dataSource.loadTOpciones('Nombre', '', 'asc',this.servTO.pageIndex, this.servTO.pageSize);
  }

  onEdit(id) {
    this.router.navigate(['edit', +id], {relativeTo: this.actRoute});
  }
  onDelete(id) {
    if (confirm('Seguro desea eliminar este elemento?')) {
      this.servTO.deleteTipoOpcions(id, this.dataSource);
    }
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
            this.servTO.pageIndex = 1;
            this.loadTipoOpcionsPage();
          })
        )
        .subscribe();

      // reset the paginator after sorting
      //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadTipoOpcionsPage())
        )
        .subscribe();
    }

    /*this.paginator.page
      .pipe(
        tap(() => this.loadPaginasEstaticasPage())
      )
      .subscribe();*/

  }

  loadTipoOpcionsPage() {
    this.dataSource.loadTOpciones(
      this.sort.active,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize);
  }
getPaginatorData(event:PageEvent)
{
  this.servTO.pageIndex=event.pageIndex+1;
  if(this.servTO.pageSize!=event.pageSize)
  {
    this.servTO.pageSize=event.pageSize;
    this.servTO.pageIndex=1;
    this.paginator.pageIndex=this.servTO.pageIndex-1;
    this.paginator.pageSize=this.servTO.pageSize;

  }

}
  ngOnDestroy(): void {
    this.sort.sortChange.unsubscribe();
  }

}
