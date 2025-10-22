import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { TransfersService } from '../../../../../services/office/transfers.service';
import {TransfersServiceDataSource} from '../../../../../services/office/transfers.service-ds';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { Usuario } from '../../../../../models/usuario.model';
import { merge } from 'rxjs/internal/observable/merge';
import { debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {LoadingIndicatorService} from '../../../../../services/loading/loading-indicator.service';
import {DateAdapter, MAT_DATE_FORMATS} from "@angular/material/core";
import {APP_DATE_FORMATS, AppDateAdapter} from "../../../../../_helpers/format-datepicker";

@Component({
  selector: 'transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class TransfersComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  dataSource;
  tableColumns: string[] = ['transferID', 'date', 'type', 'sourceUser', 'targetUser', 'points'];
  currentUser: Usuario;

  selectedOptionDateDesktop: string = '0';
  showSelectionDateDesktop: string = '';

  selectedOptionDate: string = '0';
  showSelectionDate: string = '';

  selectedOptionPoints: string = '0';
  showSelectionPoints: string = '';

  opTypePagoPublicidad: boolean = false;
  opTypeVenta: boolean = false;
  opTypeBonificacion: boolean = false;
  opTypeCompraDirecta: boolean = false;
  idTransfer: string = "";
  sourceUser: string = "";
  targetUser: string = "";
  dateFrom: string = "";
  dateTo: string = "";
  pointsFrom: string = "";
  pointsTo: string = "";

  constructor(public service: TransfersService, private router: Router,
    private actRoute: ActivatedRoute, private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<TransfersComponent>,private loading:LoadingIndicatorService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit() {

    this.dataSource = new TransfersServiceDataSource(this.service,this.loading);
    this.dataSource.loadTransfers(this.currentUser.UsuarioId, this.opTypePagoPublicidad, this.opTypeVenta, this.opTypeBonificacion, this.opTypeCompraDirecta, this.idTransfer, this.sourceUser, this.targetUser, this.dateFrom, this.dateTo, this.pointsFrom, this.pointsTo,1, 10);
    this.paginator.pageIndex = 0;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  captureSelectionDateDesktop() {
    this.showSelectionDateDesktop = this.selectedOptionDateDesktop;
  }

  captureSelectionDate() {
    this.showSelectionDate = this.selectedOptionDate;
  }

  captureSelectionPoints() {
    this.showSelectionPoints = this.selectedOptionPoints;
  }

  loadTransfersPage(){

    var date1 = '';
    var date2 = '';
      if(this.dateFrom!=null && this.dateFrom!=""){
        date1 = this.changeFormatDate(this.dateFrom);
      }
      if(this.dateTo!=null && this.dateTo!=""){
        date2 = this.changeFormatDate(this.dateTo);
      }
    this.dataSource.loadTransfers(this.currentUser.UsuarioId, this.opTypePagoPublicidad, this.opTypeVenta, this.opTypeBonificacion, this.opTypeCompraDirecta, this.idTransfer, this.sourceUser, this.targetUser, date1, date2, this.pointsFrom, this.pointsTo, this.paginator.pageIndex + 1, this.paginator.pageSize);
  }

  changeFormatDate(fecha){
    var d = new Date(fecha);
    return d.toISOString().slice(0,10);
  }

  filterClean(){
    this.opTypePagoPublicidad = false;
    this.opTypeVenta = false;
    this.opTypeBonificacion = false;
    this.opTypeCompraDirecta = false;
    this.idTransfer = "";
    this.sourceUser = "";
    this.targetUser = "";
    this.dateFrom = "";
    this.dateTo = "";
    this.pointsFrom = "";
    this.pointsTo = "";
  }

  public restrictValue(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
  
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  
   }

  ngAfterViewInit(): void {


    merge(this.paginator.page)
        .pipe(
        tap(() => this.loadTransfersPage())
    ).subscribe();

  }

  noescribe(){
    return false;
  }

}
