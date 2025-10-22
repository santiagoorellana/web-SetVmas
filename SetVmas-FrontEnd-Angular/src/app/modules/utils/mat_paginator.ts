import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MatPaginatorIntlCro extends MatPaginatorIntl {
  // translate: TranslateService;
  itemsPerPageLabel = 'Mostrando';
  nextPageLabel     = 'Siguiente';
  previousPageLabel = 'Anterior';

  public constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.subscribe((e: Event) => {
      this.injectTranslateService();
    });

    this.injectTranslateService();
  }

  getRangeLabel = function (page, pageSize, length) {
    const of = this.translate ? this.translate.instant('de') : 'of';
    if (length === 0 || pageSize === 0) {
      return '0 ' + of + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
  };

  injectTranslateService() {

    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  translateLabels() {
    this.itemsPerPageLabel = this.translate.instant(this.itemsPerPageLabel);
    this.nextPageLabel = this.translate.instant(this.nextPageLabel);
    this.previousPageLabel = this.translate.instant(this.previousPageLabel);
  }

}
