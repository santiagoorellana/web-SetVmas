import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, fromEvent } from 'rxjs/';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Usuario } from '../../../models/usuario.model';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { PaginasEstaticasService } from 'src/app/services/static-pages/paginas-estaticas.service';
import { PaginasEstaticasDataSource } from 'src/app/services/static-pages/paginas-estaticas-ds.service';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.css']
})
export class StaticPagesComponent implements OnInit, AfterViewInit, OnDestroy {

  currentUser: Usuario;
  dataSource;
  tableColumns: string[] = ['PaginasEstaticasId', 'Titulo', 'Acciones'] ;


  constructor(public servPagEst: PaginasEstaticasService, private router: Router,
    private actRoute: ActivatedRoute, private authenticationService: AuthenticationService,private loading: LoadingIndicatorService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser.Rol === 'Director') {
      this.tableColumns = ['PaginasEstaticasId', 'Titulo'];
    } else {
      this.tableColumns = ['PaginasEstaticasId', 'Titulo', 'Acciones'];
    }
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;


  ngOnInit() {
    // this.course = this.route.snapshot.data["course"];
    this.dataSource = new PaginasEstaticasDataSource(this.servPagEst, this.loading);
    // this.servPagEst.getPaginasEstaticas('','','','','');
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.servPagEst.pageIndex-1;
  this.paginator.pageSize=this.servPagEst.pageSize;

  this.dataSource.loadPEstaticas('Titulo', '', 'asc', this.servPagEst.pageIndex, this.servPagEst.pageSize);
  }

  onEdit(id) {
    this.router.navigate(['add', +id], {relativeTo: this.actRoute});
  }
  onDelete(id) {
    if (confirm('Seguro desea eliminar este elemento?')) {
      this.servPagEst.deletePaginasEstaticas(id, this.dataSource);
      this.dataSource.loadPEstaticas('Titulo', '', 'asc',this.servPagEst.pageIndex, this.servPagEst.pageSize);
    }

  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
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
          this.servPagEst.pageIndex=1;
          this.loadPaginasEstaticasPage();
        })
      )
      .subscribe();
    }

    if (this.sort !== undefined) {
    // reset the paginator after sorting
    //  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadPaginasEstaticasPage())
        )
        .subscribe();
      /*this.paginator.page
        .pipe(
          tap(() => this.loadPaginasEstaticasPage())
        )
        .subscribe();*/
      }
  }

  loadPaginasEstaticasPage() {
    this.dataSource.loadPEstaticas(
      this.sort.active,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize);
  }
getPaginatorData(event:PageEvent)
{
  this.servPagEst.pageIndex=event.pageIndex+1;
  if(this.servPagEst.pageSize!=event.pageSize)
  {
    this.servPagEst.pageSize=event.pageSize;
    this.servPagEst.pageIndex=1;
    this.paginator.pageIndex=this.servPagEst.pageIndex-1;
    this.paginator.pageSize=this.servPagEst.pageSize;

  }

}
  ngOnDestroy(): void {
    this.sort.sortChange.unsubscribe();
this.paginator.page.unsubscribe();
  }
}
