import { Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfiguracionesService } from '../configuration/configuration.service';


@Injectable({
  providedIn: 'root'
})
export class AssignBonusesService {

  resultsLength = 0;
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient, private servConfiguracion: ConfiguracionesService, private router: Router) {
  }

   getFactoresBonificacionVentas() {
     return this.http.get(this.rootURL + 'FactoresBonificacionVentas/Documento');
   }

    getClasesUsuarios() {
      return this.http.get(this.rootURL + 'ClasesUsuarios/Condiciones');
    }

    getClasesConpraventa() {
      return this.http.get(this.rootURL + 'ClasesUsuarios/Bonificaciones');
    }

    getValoresDocumento() {
      return this.http.get(this.rootURL + 'TipoTransferencias/Documento');
    }

    getPrecioPuntos() {
      return this.http.get(this.rootURL + 'VariableConfiguracions/Codigo/Precio_Puntos');
    }

    getCantReferidos() {
      return this.http.get(this.rootURL + 'VariableConfiguracions/Codigo/Cant_Max_Referidos');
    }

  getCantXReferidosBonif() {
    return this.http.get(this.rootURL + 'VariableConfiguracions/Codigo/X_PRIM_REF');
  }
    getBonificacionPorAlcanzarla() {
      return this.http.get(this.rootURL + 'ClasesUsuarios/Bonificacion');
    }



}
