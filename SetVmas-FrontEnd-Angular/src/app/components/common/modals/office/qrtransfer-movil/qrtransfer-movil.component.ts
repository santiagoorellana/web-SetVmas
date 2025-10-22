import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-qrtransfer-movil',
  templateUrl: './qrtransfer-movil.component.html',
  styleUrls: ['./qrtransfer-movil.component.css']
})
export class QRTransferMovilComponent implements OnInit {

  elementType: 'url' | 'canvas' | 'img' = 'url';
  value = 'Prueba SetV+';
  constructor(public dialogRef: MatDialogRef<QRTransferMovilComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.value = data.codigo;
  }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
