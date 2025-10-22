import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DenunciaService } from 'src/app/services/denounce/denuncia.service';
import { stringify } from 'querystring';


@Component({
  selector: 'app-edit-denuncia',
  templateUrl: './edit-denuncia.component.html',
  styleUrls: ['./edit-denuncia.component.css']
})
export class EditDenunciaComponent implements OnInit {

  constructor(public service: DenunciaService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const idP = 'id';
    this.service.getDenunciasByid(this.route.snapshot.params[idP]);
  }

  regresar() {
    this.router.navigate(['denuncia']);
  }


}
