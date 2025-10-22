import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl,
  SafeResourceUrl} from '@angular/platform-browser';
import {ConfiguracionesService} from '../../services/configuration/configuration.service';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  readonly rootURL = this.servConfiguracion.getSiteUrl();

  constructor(private servConfiguracion: ConfiguracionesService, private domSanitizer: DomSanitizer) {}

  transform(value: string): string {
    return <string> this.domSanitizer.bypassSecurityTrustUrl(this.rootURL + value);
  }

}
