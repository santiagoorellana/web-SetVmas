import { Injectable } from '@angular/core';
import {FactoresbonificacionventasModel} from '../../models/factoresbonificacionventas.model';
import {HttpClient} from '@angular/common/http';
import {ConfiguracionesService} from '../../services/configuration/configuration.service';
import {ToastrService} from 'ngx-toastr';



@Injectable()
export class FactoresbonificacionventasService {
  formData: FactoresbonificacionventasModel[]=[];
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient,
              private servConfiguracion: ConfiguracionesService,
              private  toastr: ToastrService) { }

  putFactoresBonificacionVentas(formData: FactoresbonificacionventasModel[]) {
    for (let i = 0; i < formData.length; i++) {
      this.http.put(this.rootURL + 'FactoresBonificacionVentas/' + formData[i].FactoresBonificacionVentasId, formData[i]).subscribe(
        res => {
          /*this.toastr.success('Los factores de bonificación para el nivel ' +
            formData[i].FactoresBonificacionVentasId + ' han sido modificados', 'Factores de bonificación por Venta');*/
        },
        err => {
          this.toastr.error('Error durante la actualización de los Factores de Bonificacíon ' , 'Factores de bonificación por Venta');

        }
      );
    }
    this.toastr.success('Los factores de bonificación ' +
       ' han sido modificados', 'Factores de bonificación por Venta');
  }

  getFactoresBonificacionVentas() {
     this.http.get(this.rootURL + 'FactoresBonificacionVentas').toPromise()
      .then(res => this.formData = res as FactoresbonificacionventasModel[]);
    console.log(this.formData.length);
    return this.http.get(this.rootURL + 'FactoresBonificacionVentas')
      .pipe();
  }

}
