
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})
export class QrCodeComponent implements OnInit {

  elementType: 'url' | 'canvas' | 'img' = 'url';
  value : string = 'Prueba SetV+';
  constructor(public dialogRef: MatDialogRef<QrCodeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  this.value = data.codigo;
  }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
