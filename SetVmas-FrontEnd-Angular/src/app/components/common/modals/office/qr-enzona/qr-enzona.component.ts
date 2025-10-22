import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-qr-enzona',
  templateUrl: './qr-enzona.component.html',
  styleUrls: ['./qr-enzona.component.css']
})
export class QrEnzonaComponent implements OnInit {

  elementType: 'url' | 'canvas' | 'img' = 'url';
  value = 'Prueba SetV+';
  constructor(public dialogRef: MatDialogRef<QrEnzonaComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.value = data.codigo;
  }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
