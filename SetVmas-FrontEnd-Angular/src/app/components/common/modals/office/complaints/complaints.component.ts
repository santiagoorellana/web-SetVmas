import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatOptionSelectionChange, MatTableDataSource, MatPaginator} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ClassifyAnunceComponent } from '../classify-anunce/classify-anunce.component';
import { DOCUMENT } from '@angular/common';
import { ComplaintService } from '../../../../../services/office/complaint.service';
import { ComplaintDsService } from '../../../../../services/office/complaints-ds.service';
import { Usuario } from '../../../../../models/usuario.model';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LoadingIndicatorService} from '../../../../../services/loading/loading-indicator.service';

@Component({
  selector: 'complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {

  dataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  currentUser: Usuario;

  // tableColumns: string[] = ['select', 'complaint', 'state', 'anunceID', 'userID', 'date', 'time'];
  tableColumns: string[] = ['Denuncias', 'Estado', 'anunceID', 'userID', 'date', 'time'];

  selection = new SelectionModel<any>(true, []);

  constructor(public service: ComplaintService, private authenticationService: AuthenticationService,
              public dialogRef: MatDialogRef<ComplaintsComponent>, public dialog: MatDialog,
              @Inject(DOCUMENT) private document: Document,private loading:LoadingIndicatorService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    // this.paginator.pageIndex = 0;
    this.dataSource = new ComplaintDsService(this.service,this.loading);
    // this.dataSource.loadCDenuncia(this.currentUser.UsuarioId, 1, 10);
    this.dataSource.loadCComplaint( this.currentUser.UsuarioId,1, 10);
  }

  // Click parta celar el modal
  onCloseClick(): void {
    this.dialogRef.close();
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

  /**Para la tabla**/

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
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}
}
