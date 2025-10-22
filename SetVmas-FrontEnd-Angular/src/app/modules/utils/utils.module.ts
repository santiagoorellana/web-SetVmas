import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { FooterComponent } from '../../components/common/footer/footer.component';

// DIRECTIVES
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlCro } from './mat_paginator';
import { TranslateService } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    FooterComponent
  ],
  providers: [{ provide: MatPaginatorIntl,useClass: MatPaginatorIntlCro}],
})
export class UtilsModule { }
