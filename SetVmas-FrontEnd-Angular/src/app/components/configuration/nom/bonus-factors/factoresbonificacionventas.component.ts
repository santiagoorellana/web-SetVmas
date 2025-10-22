import { Component, OnInit } from '@angular/core';
import {FactoresbonificacionventasService} from '../../../../services/bonus-factors/factoresbonificacionventas.service';
import {NgForm} from '@angular/forms';
import {FactoresbonificacionventasServiceDataSource} from '../../../../services/bonus-factors/factoresbonificacionventas.service-ds';
import {LoadingIndicatorService} from '../../../../services/loading/loading-indicator.service';


@Component({
  selector: 'app-factoresbonificacionventas',
  templateUrl: './factoresbonificacionventas.component.html',
  styleUrls: ['./factoresbonificacionventas.component.css']
})
export class FactoresbonificacionventasComponent implements OnInit {
  constructor(public servFBV: FactoresbonificacionventasService,private loading: LoadingIndicatorService) { }
  dataSource ;
  tableColumns: string[] = ['FactoresBonificacionVentasId', 'Nivel', 'ClaseDiamante', 'ClaseOro', 'ClasePlata',
    'ClaseBronce', 'ClaseIniciada'];
  ngOnInit() {
    this.dataSource = new FactoresbonificacionventasServiceDataSource(this.servFBV, this.loading);
    this.dataSource.loadFBV();

  }
  salvarFactores(form: NgForm) {

    this.servFBV.putFactoresBonificacionVentas(this.servFBV.formData);
  }
}
