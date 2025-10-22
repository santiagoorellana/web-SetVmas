import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';

// import { environment } from './where-ever-envi-file-is';
// import { Report } from './a-type-you-create-to-decribe-your-report-info';
@Component({
  selector: 'app-view-reports',
   templateUrl: './view-reports.component.html',
  // template: '<iframe id="reportRenderFrame" seamless scrolling="no" width="100%" height="800px" [src]="reportUrl"></iframe>',
  styleUrls: ['./view-reports.component.css']
})
export class ViewReportsComponent implements OnInit {

  reportServer = this.servCo.ReportServerUrl;
  reportUrl = 'MyReports/SampleReport';
  showParameters = 'true';
  parameters: any = {
    /*'SampleStringParameter': null,
    'SampleBooleanParameter' : false,
    'SampleDateTimeParameter' : '9/1/2017',
    'SampleIntParameter' : 1,
    'SampleFloatParameter' : '123.1234',
    'SampleMultipleStringParameter': ['Parameter1', 'Parameter2']*/
  };
  language = 'en-us';
  width = 100;
  height = '100%';
  toolbar = 'true';

  id = "0";

  constructor(private domSanitizer: DomSanitizer, private route: ActivatedRoute, private servCo: ConfiguracionesService) { }



  ngOnInit() {
    const idP = 'id';

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get(idP);
      switch (/*this.route.snapshot.params[idP]*/ this.id) {
        case '1': {
          console.log(1);
          this.reportUrl = 'estdcategoria';
          break;
        }
        case '2': {
          console.log(2);
          this.reportUrl = 'estdclasesusuario';
          break;
        }
        case '3': {
          console.log(3);
          this.reportUrl = 'estdetiquetas';
          break;
        }
        case '4': {
          console.log(4);
          this.reportUrl = 'estdmunicipio';
          break;
        }
        case '5': {
          console.log(5);
          this.reportUrl = 'estdprovincia';
          break;
        }
        case '6': {
          console.log(6);
          this.reportUrl = 'estdhistogramaclases';
          break;
        }
        case '7': {
          console.log(7);
          this.reportUrl = 'estdhistogramaanuncios';
          break;
        }
        case '8': {
          console.log(8);
          this.reportUrl = 'estdgenerales';
          break;
        }

      }
    });


  }
 /* public reportUrl: SafeResourceUrl; // make public to be used on the template
  @Input() report: any; // Report;
  @Input() ids: Array<number>;




  private generateReportURLString(report: any/*Report*//*, ids: Array<number>): string {
    let reportServerUrl: string;
    reportServerUrl = this.servCo.ReportServerUrl;
    reportServerUrl += '?&reportPath=' + encodeURIComponent(report.externalLocation);
    const idsJoined = this.ids.join(); // string contacted ids seperated by commas for the url
    reportServerUrl += '&RAMSnapshotID=' + idsJoined + '&IsCompare=False';
    return this.domSanitizer.bypassSecurityTrustResourceUrl( reportServerUrl ).toString();
  }
*/


}


