import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { MotivoDenunciaService } from '../../../../services/motive-denounce/motivo-denuncia.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MotivoDenunciaServiceDataSource} from '../../../../services/motive-denounce/motivo-denuncia.service-ds';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {merge} from 'rxjs/internal/observable/merge';
import {LoadingIndicatorService} from '../../../../services/loading/loading-indicator.service';
import {MatDialog} from '@angular/material/dialog';
import {DeleteComponent} from '../../../common/modals/delete/delete.component';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-motivo-denuncia',
  templateUrl: './motivo-denuncia.component.html',
  styleUrls: ['./motivo-denuncia.component.css']
})
export class MotivoDenunciaComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;
  constructor(public service: MotivoDenunciaService,public dialog: MatDialog,  private router: Router, private loading: LoadingIndicatorService,private actRoute: ActivatedRoute) { }


  ngOnInit() {
    this.dataSource = new MotivoDenunciaServiceDataSource(this.service, this.loading);
  this.paginator.pageIndex=this.service.pageIndex-1;
  this.paginator.pageSize=this.service.pageSize;
    // If the user changes the sort order, reset back to the first page.
    this.dataSource.loadMotivos('Nombre', '', 'asc', this.service.pageIndex, this.service.pageSize);

   /* this.service.getMotivoDenuncia();
    this.service.dataSource.paginator = this.paginator;//paginado*/
  }

  onEdit(id) {
    this.router.navigate(['add', +id], { relativeTo: this.actRoute });
  }


  onDelete(id) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '285px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(Boolean(JSON.parse(result)))
      {
        this.service.deleteMotivoDenuncia(id, this.dataSource);
      }
    });
    // if (confirm('Seguro desea eliminar este elemento?')) {
    //   this.service.deleteMotivoDenuncia(id, this.dataSource);
    //
    // }
  }

  applyFilter(filterValue: string) {
    this.service.dataSource.filter = filterValue.trim().toLowerCase();
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
            this.service.pageIndex = 1;
            this.loadMotivoDenunciaPage();
          })
        )
        .subscribe();

      // reset the paginator after sorting
     // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadMotivoDenunciaPage())
        )
        .subscribe();
    }
  }

  loadMotivoDenunciaPage() {
    this.dataSource.loadMotivos(
      this.sort.active,
      this.input.nativeElement.value,
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
}
