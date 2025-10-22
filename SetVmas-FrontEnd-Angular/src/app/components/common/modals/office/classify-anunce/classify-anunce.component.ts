import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'classify-anunce',
  templateUrl: './classify-anunce.component.html',
  styleUrls: ['./classify-anunce.component.css']
})
export class ClassifyAnunceComponent implements OnInit {

  tags: string[] = ['fotógrafo', 'estudio', 'videoclip', 'publicidad', 'tienda virtual', 'marketplace', 'barbero'];

  imgsAnunce: string[] = ['../../../../../assets/images/imagen-anuncio1.png',
                          '../../../../../assets/images/imagen-anuncio2.png',
                          '../../../../../assets/images/imagen-anuncio3.png',
                          '../../../../../assets/images/imagen-anuncio1.png',
                          '../../../../../assets/images/imagen-anuncio2.png',
                          '../../../../../assets/images/imagen-anuncio3.png'];

  constructor(public dialogRef: MatDialogRef<ClassifyAnunceComponent>) {
  }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
