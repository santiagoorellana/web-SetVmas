import { Router, ActivatedRoute } from '@angular/router';
import { EtiquetaService } from '../../../services/tags/etiqueta.service';
import { Etiqueta } from '../../../models/etiqueta.model';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy,Output } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { MatTableDataSource } from '@angular/material/table';
import { EtiquetaDsService } from 'src/app/services/tags/etiqueta-ds.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { LoadingIndicatorService } from 'src/app/services/loading/loading-indicator.service';
import {MatDialog} from '@angular/material/dialog';
import {DeleteComponent} from '../../common/modals/delete/delete.component';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';


// const initialSelection = [];
// const allowMultiSelect = true;
// this.selection = new SelectionModel<Etiqueta>(allowMultiSelect, initialSelection);

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit, AfterViewInit, OnDestroy {

  selection = new SelectionModel<Etiqueta>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;
  dataSource;


  @Output() pageEvent:PageEvent;

  tableColumns: string[] = ['EtiquetaId', 'Nombre', 'CantUsada', 'Acciones'];//si pongo 'select' en la primera posicion adicionam el check


  constructor(public service: EtiquetaService, private router: Router,public dialog: MatDialog,
    private loading: LoadingIndicatorService, private actRoute: ActivatedRoute,public toastr: ToastrService) {

}


  ngOnInit() {
    this.dataSource = new EtiquetaDsService(this.service, this.loading);
    // If the user changes the sort order, reset back to the first page.
  this.paginator.pageIndex=this.service.pageIndex-1;
  this.paginator.pageSize=this.service.pageSize;


    this.dataSource.loadCetiquetas('Nombre', '', 'asc', this.service.pageIndex, this.service.pageSize);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.service.dataSource.data.length;
    return numSelected === numRows;
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.service.dataSource.data.forEach(row => this.selection.select(row));
  }


  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Etiqueta): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }
  removeSelectedRows() {

    this.selection.selected.forEach(item => {
      let index: number = this.service.listaEtiqueta.findIndex(d => d === item);
      console.log(this.service.listaEtiqueta.findIndex(d => d === item));
      this.service.listaEtiqueta.splice(index, 1)
      this.onDelete(item.EtiquetaId);
      this.service.getEtiquetas('Nombre', '', 'asc',  this.service.pageIndex, this.service.pageSize);
    });
    this.selection = new SelectionModel<Etiqueta>(true, []);
  }


  applyFilter(filterValue: string) {
    this.service.dataSource.filter = filterValue.trim().toLowerCase();
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
        this.service.deleteEtiqueta(id, this.dataSource);
      }
    });

    // if (confirm('Seguro desea eliminar este elemento?')) {
    //   this.service.deleteEtiqueta(id, this.dataSource);
    //
    // }
  }

  ngAfterViewInit(): void {

    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.service.pageIndex=1;
          this.loadEtiquetasPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
  // this.sort.sortChange.subscribe(() =>this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadEtiquetasPage())
      )
      .subscribe();
  }

  loadEtiquetasPage() {
    this.dataSource.loadCetiquetas(
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


