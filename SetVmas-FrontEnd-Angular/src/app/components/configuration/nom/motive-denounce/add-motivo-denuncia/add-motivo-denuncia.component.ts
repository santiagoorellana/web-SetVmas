import { Component, OnInit } from '@angular/core';
import { MotivoDenunciaService } from '../../../../../services/motive-denounce/motivo-denuncia.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-motivo-denuncia',
  templateUrl: './add-motivo-denuncia.component.html',
  styleUrls: ['./add-motivo-denuncia.component.css']
})
export class AddMotivoDenunciaComponent implements OnInit {

  constructor(public service: MotivoDenunciaService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = 'id';
    this.service.getMotivoDenunciaByid(this.route.snapshot.params[id]);
  }

  regresar() {
    this.router.navigate(['motivoDenuncia']);
  }

}
