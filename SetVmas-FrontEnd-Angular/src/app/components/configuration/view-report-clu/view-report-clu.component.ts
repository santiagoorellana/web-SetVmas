import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';

@Component({
  selector: 'app-view-report-clu',
  templateUrl: './view-report-clu.component.html',
  styleUrls: ['./view-report-clu.component.css']
})
export class ViewReportCluComponent implements OnInit {

  rangoI = 0;
  rangoF = 0;
  reportServer = this.servCo.ReportServerUrl;
  reportUrl = 'MyReports/SampleReport';
  showParameters = 'true';
  parameters: any = {
    'rangoI': this.rangoI,
    'rangoF': this.rangoF
    
  };
  language = 'en-us';
  width = 100;
  height = 100;
  toolbar = 'true';
  mostrarRepo = false;

  constructor(private route: Router, private servCo: ConfiguracionesService) { }

  ngOnInit() {
  }

  imprimirReporte() {
    if (this.rangoI > this.rangoF) {
      this.rangoI = this.rangoF;
    }
    this.parameters  = {
      'rangoI': this.rangoI,
      'rangoF': this.rangoF,

    };
    this.reportUrl = 'estdhistogramaclasesusuarios';
    this.mostrarRepo = true;
  }
}
