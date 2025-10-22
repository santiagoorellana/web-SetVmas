import {Component, OnInit, ElementRef, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ConfiguracionesService} from '../../../../../services/configuration/configuration.service';
import {PurchaseService} from '../../../../../services/office/purchase.service';
import {AuthenticationService} from '../../../../../services/auth/authentication.service';
import {Usuario} from '../../../../../models/usuario.model';
import {ToastrService} from 'ngx-toastr';
import {DOCUMENT} from '@angular/common';
import {QrEnzonaComponent} from "../qr-enzona/qr-enzona.component";
import {Overlay} from "@angular/cdk/overlay";
import {LoadingIndicatorService} from "../../../../../services/loading/loading-indicator.service";
import {BehaviorSubject} from "rxjs";
import {QRTransferMovilComponent} from "../qrtransfer-movil/qrtransfer-movil.component";

// import { TheadTitlesRowComponent } from 'ng2-smart-table/lib/components/thead/rows/thead-titles-row.component';

@Component({
  selector: 'direct-purchase',
  templateUrl: './direct-purchase.component.html',
  styleUrls: ['./direct-purchase.component.css']
})

export class DirectPurchaseComponent implements OnInit {

  currentUser: Usuario;
  purchaseData: any;
  selectedOption: string = '0';
  showSelection: string = '';
  monto: number = 1;
  total: number = 0;
  isLoading = false;
  texto: string;
  values: string = '';
  valida: boolean;
  iniciar: boolean;
  tarjeta: string = "";
  phone: string = "";
  valor: string = "";
  field1: string;
  field2: string;
  field3: string;
  field4: string;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  constructor(public dialog: MatDialog, private overlay: Overlay,
              @Inject(DOCUMENT) private document: Document, public dialogRef: MatDialogRef<DirectPurchaseComponent>,
              private authenticationService: AuthenticationService, private servConfiguracion: ConfiguracionesService,
              private purchaseService: PurchaseService, public toastr: ToastrService, private loading: LoadingIndicatorService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.purchaseService.getPurchaseViewData()
      .subscribe(
        result => {
          this.purchaseData = result;
          this.isLoading = true;
        }
      );
  }

  ngOnInit() {


  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

  captureSelection() {

    this.showSelection = this.selectedOption;

  }

  desglose(cadena: string) {
    this.field1 = cadena.substring(0, 4);
    this.field2 = cadena.substring(5, 9);
    this.field3 = cadena.substring(10, 14);
    this.field4 = cadena.substring(15, 19);

  }


  onlyNumber(field: string) {
    if (field.includes('-')) {
      return true;
    } else {
      return false;
    }


  }

  guionesCorrectos(cadena: string) {
    alert(cadena.substr(4) == '-')


  }

  totalPoints() {
    this.total = this.monto / (parseFloat(this.purchaseData.PointPrice));
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
    if (e.which === 43) {
      return true;
    }
    //si escribo guion
    /*if (e.which === 45) {
      return true;
    }

     //si escribo espacio
     if (e.which === 32) {
      return true;
    }*/

    this.validar(e);

    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);


  }


  validar(data) {
    if (this.tarjeta.length == 4) {
      data.target.value = data.target.value + '-';

    }

    if (this.tarjeta.length == 9) {
      data.target.value = data.target.value + '-';
    }

    if (this.tarjeta.length == 14) {
      data.target.value = data.target.value + '-';
    }


  }


  //this.purchaseService.salvarCompra(this.selectedOption,this.monto, this.tarjeta, this.phone, this.currentUser.UsuarioId, 1);


  Comprar() {


    if (this.monto != null && this.monto > 0) {

      if (this.selectedOption == "1" && this.total < (this.purchaseData.MinPointsBankTransfer)) {

        this.toastr.error('El mínimo de puntos a comprar es: ' + this.purchaseData.MinPointsBankTransfer, 'Error!');
        return;
      }
      if (this.selectedOption == "2" && this.total < (this.purchaseData.MinPointsPhoneTransfer)) {

        this.toastr.error('El mínimo de puntos a comprar es: ' + this.purchaseData.MinPointsPhoneTransfer, 'Error!');
        return;
      }
      if (this.selectedOption == "3" && this.total < (this.purchaseData.MinPointsDirectContact)) {

        this.toastr.error('El mínimo de puntos a comprar es: ' + this.purchaseData.MinPointsDirectContact, 'Error!');
        return;
      }

      if (this.selectedOption == "1" && this.tarjeta != "") {

        if (this.tarjeta.length < 19) {
          this.toastr.error('Número de tarjeta no válido', 'Error!');
          //this.onCloseClick();
          return;
        }

        if (this.tarjeta.length == 19) {


          this.desglose(this.tarjeta);


          if ((this.field1.indexOf('-') == -1) && (this.field2.indexOf('-') == -1) && (this.field3.indexOf('-') == -1) && (this.field4.indexOf('-') == -1)) {

            if ((this.tarjeta.charAt(4) == '-') && (this.tarjeta.charAt(14) == '-') && (this.tarjeta.charAt(9) == '-')) {

              //tarjeta válida

              this.purchaseService.salvarCompra(this.selectedOption, this.monto, this.tarjeta, this.phone, this.currentUser.UsuarioId, 1)

                .subscribe(
                  res => {
                    this.toastr.success('Se ha guardado su pedido. Sus puntos estarán disponibles dentro de las 48 hras posteriores al pago.', 'Transacción: ' + res);
                    this.dialogRef.close();
                  },
                  err => {
                    this.toastr.error('Hubo un error del sistema durante la compra, inténtelo de nuevo', err);
                  }
                );

              return true;//this.onCloseClick();

            } else {
              this.toastr.error('Número de tarjeta no válida', 'Error!');
              return;//this.onCloseClick();

            }

          } else {//no es una tarjeta válida*/

            this.toastr.error('Número de tarjeta no válida', 'Error!');
            return; // this.onCloseClick();


          }
        }


      }


      if ((this.selectedOption == "2" && this.phone != "") || this.selectedOption == "3")
      //  if((this.selectedOption=="1" && this.tarjeta!="") || (this.selectedOption=="2" && this.phone!="") || this.selectedOption=="3")
      {


        this.purchaseService.salvarCompra(this.selectedOption, this.monto, this.tarjeta, this.phone, this.currentUser.UsuarioId, 1)
          .subscribe(
            res => {
              this.toastr.success('Se ha guardado su pedido. Sus puntos estarán disponibles dentro de las 48 hras posteriores al pago.', 'Transacción: ' + res);
              this.dialogRef.close();
              },
            err => {
              this.toastr.error('Hubo un error del sistema durante la compra, inténtelo de nuevo', err);
            }
          );
        return; // this.onCloseClick();
      }
    }
    if (this.monto == null || this.monto == 0) {
      this.toastr.error('Debes introducir un monto', 'Error!');
    }
    if (this.selectedOption == "1" && this.tarjeta == "") {
      this.toastr.error('Debes introducir una tarjeta', 'Error!');
    }

    if (this.selectedOption == "2" && this.phone == "") {
      this.toastr.error('Debes introducir un número de móvil', 'Error!');
    }
    if (this.selectedOption == "0") {
      this.toastr.error('Seleccione una forma de pago', 'Error!');
    }

  }

  PagarEnZona() {
    if ( this.tarjeta == "") {
      this.toastr.error('Debes introducir una tarjeta', 'Error!');
      this.loading.showLoading(false);
      this.loadingSubject.next(false);
      return false;
    }

    if (this.monto != null && this.monto > 0) {

      if (this.total < (this.purchaseData.MinPointsBankTransfer)) {

        this.toastr.error('El mínimo de puntos a comprar es: ' + this.purchaseData.MinPointsBankTransfer, 'Error!');
        this.loading.showLoading(false);
        this.loadingSubject.next(false);
        return false;
      }
      if (this.monto == null || this.monto == 0) {
        this.toastr.error('Debes introducir un monto', 'Error!');
        this.loading.showLoading(false);
        this.loadingSubject.next(false);
        return false;
      }
      //tarjeta válida
      if (this.selectedOption == "1" && this.tarjeta != "") {

        if (this.tarjeta.length < 19) {
          this.toastr.error('Número de tarjeta no válido', 'Error!');
          //this.onCloseClick();
          this.loading.showLoading(false);
          this.loadingSubject.next(false);
          return;
        }

        if (this.tarjeta.length == 19) {


          this.desglose(this.tarjeta);


          if ((this.field1.indexOf('-') == -1) && (this.field2.indexOf('-') == -1) && (this.field3.indexOf('-') == -1) && (this.field4.indexOf('-') == -1)) {

            if ((this.tarjeta.charAt(4) == '-') && (this.tarjeta.charAt(14) == '-') && (this.tarjeta.charAt(9) == '-')) {

              //tarjeta válida

              this.purchaseService.salvarCompra(this.selectedOption, this.monto, this.tarjeta, this.phone, this.currentUser.UsuarioId, 1)

                .subscribe(
                  res => {
                    this.toastr.success('Se ha guardado su pedido. Sus puntos estarán disponibles dentro de las 48 hras posteriores al pago.', 'Transacción: ' + res);
                    this.loading.showLoading(false);
                    this.loadingSubject.next(false);
                    const codigo = 'https://setvmas.com/#/r/' + this.currentUser.Codigo;
                    const dialogRef = this.dialog.open(QrEnzonaComponent, {
                      width: '360px',
                      height: 'auto',
                      data: {codigo}
                    });

                    this.document.body.classList.add('noscroll');

                    dialogRef.afterClosed().subscribe(result => {
                      this.document.body.classList.remove('noscroll');
                    });
                    this.loading.showLoading(false);
                    this.loadingSubject.next(false);
                    this.dialogRef.close();
                    return true;

                  },
                  err => {
                    this.toastr.error('Hubo un error del sistema durante la compra, inténtelo de nuevo', err);
                    this.loading.showLoading(false);
                    this.loadingSubject.next(false);
                    return false;
                  }
                );

              //return true;//this.onCloseClick();

            } else {
              this.toastr.error('Número de tarjeta no válida', 'Error!');
              this.loading.showLoading(false);
              this.loadingSubject.next(false);
              return;//this.onCloseClick();

            }

          } else {//no es una tarjeta válida*/

            this.toastr.error('Número de tarjeta no válida', 'Error!');
            this.loading.showLoading(false);
            this.loadingSubject.next(false);
            return; // this.onCloseClick();


          }
        }


      }



    }





  }



  PagarTranferMovil() {
    if ( this.tarjeta == "") {
      this.toastr.error('Debes introducir una tarjeta', 'Error!');
      this.loading.showLoading(false);
      this.loadingSubject.next(false);
      return false;
    }

    if (this.monto != null && this.monto > 0) {

      if (this.total < (this.purchaseData.MinPointsBankTransfer)) {

        this.toastr.error('El mínimo de puntos a comprar es: ' + this.purchaseData.MinPointsBankTransfer, 'Error!');
        this.loading.showLoading(false);
        this.loadingSubject.next(false);
        return false;
      }
      if (this.monto == null || this.monto == 0) {
        this.toastr.error('Debes introducir un monto', 'Error!');
        this.loading.showLoading(false);
        this.loadingSubject.next(false);
        return false;
      }
      //tarjeta válida
      if (this.selectedOption == "1" && this.tarjeta != "") {

        if (this.tarjeta.length < 19) {
          this.toastr.error('Número de tarjeta no válido', 'Error!');
          //this.onCloseClick();
          this.loading.showLoading(false);
          this.loadingSubject.next(false);
          return;
        }

        if (this.tarjeta.length == 19) {


          this.desglose(this.tarjeta);


          if ((this.field1.indexOf('-') == -1) && (this.field2.indexOf('-') == -1) && (this.field3.indexOf('-') == -1) && (this.field4.indexOf('-') == -1)) {

            if ((this.tarjeta.charAt(4) == '-') && (this.tarjeta.charAt(14) == '-') && (this.tarjeta.charAt(9) == '-')) {

              //tarjeta válida

              this.purchaseService.salvarCompra(this.selectedOption, this.monto, this.tarjeta, this.phone, this.currentUser.UsuarioId, 1)

                .subscribe(
                  res => {
                    this.toastr.success('Se ha guardado su pedido. Sus puntos estarán disponibles dentro de las 48 hras posteriores al pago.', 'Transacción: ' + res);
                    this.loading.showLoading(false);
                    this.loadingSubject.next(false);
                    const codigo = 'https://setvmas.com/#/r/' + this.currentUser.Codigo;
                    const dialogRef = this.dialog.open(QRTransferMovilComponent, {
                      width: '360px',
                      height: 'auto',
                      data: {codigo}
                    });

                    this.document.body.classList.add('noscroll');
                    this.dialogRef.close();
                    dialogRef.afterClosed().subscribe(result => {
                      this.document.body.classList.remove('noscroll');
                    });
                    this.loading.showLoading(false);
                    this.loadingSubject.next(false);

                    return true;

                  },
                  err => {
                    this.toastr.error('Hubo un error del sistema durante la compra, inténtelo de nuevo', err);
                    this.loading.showLoading(false);
                    this.loadingSubject.next(false);
                    return false;
                  }
                );

              //return true;//this.onCloseClick();

            } else {
              this.toastr.error('Número de tarjeta no válida', 'Error!');
              this.loading.showLoading(false);
              this.loadingSubject.next(false);
              return;//this.onCloseClick();

            }

          } else {//no es una tarjeta válida*/

            this.toastr.error('Número de tarjeta no válida', 'Error!');
            this.loading.showLoading(false);
            this.loadingSubject.next(false);
            return; // this.onCloseClick();


          }
        }


      }



    }





  }



  // Open Modal QR
  openDialogQR( opcion): void {
    this.loading.showLoading(true);
    this.loadingSubject.next(true);
    if (opcion === 1) {
      this.PagarEnZona();
    } else {
      this.PagarTranferMovil();
    }

  }

  copiarEnlace() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    // selBox.value = this.currentUser.Url;
    selBox.value = this.purchaseData.NoCard;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success('Número de tarjeta copiado al portapapeles.');

  }

}
