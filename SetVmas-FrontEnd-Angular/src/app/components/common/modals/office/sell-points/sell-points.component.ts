import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SellPointService } from '../../../../../services/office/sell-points.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { Usuario } from '../../../../../models/usuario.model';
import {JsonObject, JsonValue} from "@angular/compiler-cli/ngcc/src/packages/entry_point";

@Component({
  selector: 'sell-points',
  templateUrl: './sell-points.component.html',
  styleUrls: ['./sell-points.component.css']
})

export class SellPointsComponent implements OnInit {
    buyer;
    amount;
    currentUser: Usuario;
    constructor(public dialogRef: MatDialogRef<SellPointsComponent>, private authenticationService: AuthenticationService, private sellservice: SellPointService,public toaster: ToastrService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  ngOnInit() {
  }

   isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

  onSellClick() {
 if(this.amount==null || this.amount=="" || this.buyer==null || this.buyer==""){
          this.toaster.error('Debe llenar todos los campos', 'Venta de Puntos');
      }else
    if(this.amount==null || this.amount=="" || this.amount== 0){
      this.toaster.error('La cantidad de puntos debe ser mayor que 0.', 'Venta de Puntos');
    }else
      if(this.currentUser.Puntos >= this.amount)
    {
      this.sellservice.postVentaPuntos(this.currentUser.UsuarioId, this.buyer, this.amount)
        .subscribe(
            res => {
               //alert((res as string));
             if((res as string) === "not-found"){
               this.toaster.error('No se encontró el usuario comprador', 'Venta de Puntos');
             }else if((res as string) === "auto-venta"){
               this.toaster.error('La auto venta no está permitida', 'Venta de Puntos');
             }else if((res as string) === "not-clase"){
               this.toaster.error('Solo se puede vender a usuarios de clase inferior', 'Venta de Puntos');
             }else if((res as string) === "not-diamante"){
               this.toaster.error('Sólo el administrador puede vender puntos a un usuario de clase diamante', 'Venta de Puntos');
             }
             else{
               this.toaster.success('La venta ha sido exitosa', 'Venta de Puntos');
             }



          this.onCloseClick();
        },
            err => {

          this.toaster.error('Error durante la venta', 'Venta de Puntos');
          this.onCloseClick();
        }
    );
    }else if(this.isNumber(this.amount)==false){
      this.toaster.error('Escriba sólo números');
    }

    else
      this.toaster.error('Ud. no tiene suficientes puntos para vender.', 'Venta de Puntos');


  }



  onCloseClick(): void {
    this.dialogRef.close();
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
  }

   soloNumeros(e){
    var key = window.event ? e.which : e.keyCode;
    if (key < 48 || key > 57) {
        //Usando la definición del DOM level 2, "return" NO funciona.
        e.preventDefault();
    }
  }

}
