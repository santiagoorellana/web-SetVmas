import { Component, OnInit } from '@angular/core';
import { TipoTransferenciaService } from '../../../../../services/type-transfers/tipo-transferencia.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tipo-transferencia-add',
  templateUrl: './tipo-transferencia-add.component.html',
  styleUrls: ['./tipo-transferencia-add.component.css']
})
export class TipoTransferenciaAddComponent implements OnInit {

  constructor(public service: TipoTransferenciaService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = 'id';
    this.service.getTipoTransferenciaByid(this.route.snapshot.params[id]);
  }

  regresar() {
    this.router.navigate(['tipoTransferencia']);
  }

}
