import { Component, OnInit , Input} from '@angular/core';

import {Router} from '@angular/router';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';

@Component({
  selector: 'app-view-report-puntos',
  templateUrl: './view-report-puntos.component.html',
  styleUrls: ['./view-report-puntos.component.css']
})
export class ViewReportPuntosComponent implements OnInit {

  rango = 0;
  reportServer:string = this.servCo.ReportServerUrl;
  reportUrl:string = 'MyReports/SampleReport';
  showParameters:string = 'true';
  parameters: any = {
    'SampleStringParameter': null,
    'SampleBooleanParameter' : false,
    'SampleDateTimeParameter' : '9/1/2017',
    'SampleIntParameter' : 1,
    'SampleFloatParameter' : '123.1234',
    'SampleMultipleStringParameter': ['Parameter1', 'Parameter2']
  };
 language:string = 'en-us';
 width:number = 100;
 height:number = 100;
 toolbar:string = 'true';
 mostrarRepo:boolean = false;

  constructor(private route: Router, private servCo: ConfiguracionesService) { }

  ngOnInit() {
  }

  imprimirReporte() {
    this.parameters = {
      'rango': this.rango
    };

    this.reportUrl = 'estdhistogramapuntos';
    this.mostrarRepo = true;
  }


}
