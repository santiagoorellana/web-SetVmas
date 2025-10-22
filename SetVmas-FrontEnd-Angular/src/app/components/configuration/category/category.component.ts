import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryServiceDataSource} from '../../../services/category/categoria.service-ds';
import {CategoryService} from '../../../services/category/category.service';
import {fromEvent, merge} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {DeleteComponent} from '../../common/modals/delete/delete.component';
import {SelectionModel} from '@angular/cdk/collections';
import {Transferencia} from '../../../models/transferencia.model';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit , AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['name', 'image', 'renewable', 'options'];
  dataSource;
  isLoadComplete = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; // paginado
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;

  constructor(public service: CategoryService, private router: Router, public dialog: MatDialog,  private toastr: ToastrService,
              private actRoute: ActivatedRoute, private loading: LoadingIndicatorService) {}

  ngOnInit() {
    this.dataSource = new CategoryServiceDataSource(this.service, this.loading);
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.service.pageIndex-1;
  this.paginator.pageSize=this.service.pageSize;
    this.dataSource.loadCcategoria('Nombre', '','asc', this.service.pageIndex, this.service.pageSize);

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
        this.service.deleteCategoria(id, this.dataSource);
      }
    });

    // if (confirm('Seguro desea eliminar este elemento?')) {
    //   this.service.deleteCategoria(id, this.dataSource);
    // }
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
            this.loadCategoriasPage();
          })
        )
        .subscribe();

      // reset the paginator after sorting
 //     this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadCategoriasPage())
        )
        .subscribe();
    }

  }

  loadCategoriasPage() {
    this.dataSource.loadCcategoria(
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
