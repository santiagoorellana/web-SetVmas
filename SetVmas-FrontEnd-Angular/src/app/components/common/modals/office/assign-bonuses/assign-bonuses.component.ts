import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatOptionSelectionChange, MatTableDataSource} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import {AssignBonusesService} from '../../../../../services/office/assign-bonuses.service';
import { ConfiguracionesService } from '../../../../../services/configuration/configuration.service';
import {LoadingIndicatorService} from '../../../../../services/loading/loading-indicator.service';
import {VariableConfiguracion} from "../../../../../models/variable-configuracion.model";

@Component({
  selector: 'assign-bonuses',
  templateUrl: './assign-bonuses.component.html',
  styleUrls: ['./assign-bonuses.component.css']
})
export class AssignBonusesComponent implements OnInit {

  T_FactoresBonificacionVentas: any;
  T_ClasesUsuarios: any;
  T_Compraventas: any;
  T_Valores: any;
  T_Clases: any;
  precio: VariableConfiguracion;
  CantRef: VariableConfiguracion;
  CantX_PRIM_REF: VariableConfiguracion;

  isLoad = false;

  tableColumnsFB: string[] = ['Nombre', 'DIAMANTE', 'ORO', 'PLATA', 'BRONCE', 'INICIADO'];
  tableColumnsCU: string[] = ['Condiciones', 'DIAMANTE', 'ORO', 'PLATA', 'BRONCE'];
  tableColumnsCV: string[] = ['Bonificaciones', 'DIAMANTE', 'ORO', 'PLATA', 'BRONCE', 'INICIADO'];

  constructor(public dialogRef: MatDialogRef<AssignBonusesComponent>, private asignarbonusesService: AssignBonusesService,
              private servConfiguracion: ConfiguracionesService, private loadingIndicator: LoadingIndicatorService) {
  }

  ngOnInit() {
    this.loadingIndicator.showLoading(true);
    this.asignarbonusesService.getFactoresBonificacionVentas()
      .subscribe(result => {

        this.T_FactoresBonificacionVentas = result;

      }
    );

    this.asignarbonusesService.getClasesUsuarios()
      .subscribe(result => {
        this.T_ClasesUsuarios = result;
      }
    );

    this.asignarbonusesService.getClasesConpraventa()
      .subscribe(result => {
        this.T_Compraventas = result;
      }
    );

    this.asignarbonusesService.getValoresDocumento()
      .subscribe(result => {
        this.T_Valores = result;
        this.isLoad = true;
      }
      );

    this.asignarbonusesService.getPrecioPuntos()
      .subscribe(result => {
          this.precio = result as VariableConfiguracion;
          this.isLoad = true;
        }
      );
    this.asignarbonusesService.getCantReferidos()
      .subscribe(result => {
          this.CantRef = result as VariableConfiguracion;
          this.isLoad = true;
        }
      );
    this.asignarbonusesService.getCantXReferidosBonif()
      .subscribe(result => {
          this.CantX_PRIM_REF = result as VariableConfiguracion;
          this.isLoad = true;
        }
      );

    this.asignarbonusesService.getBonificacionPorAlcanzarla()
      .subscribe(result => {
          this.T_Clases = result;
          this.isLoad = true;
        }
      );

    this.loadingIndicator.showLoading(false);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }


}
