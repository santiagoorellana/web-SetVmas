import { Component, OnInit } from '@angular/core';
import { VariableConfiguracionService } from '../../../../services/variable/variable-configuracion.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-variable-configuracion',
  templateUrl: './add-variable-configuracion.component.html',
  styleUrls: ['./add-variable-configuracion.component.css']
})
export class AddVariableConfiguracionComponent implements OnInit {

  constructor(public service: VariableConfiguracionService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = 'id';
    this.service.getVariableConfiguracionByid(this.route.snapshot.params[id]);
  }
  regresar() {
    this.router.navigate(['variableconfiguracion']);
  }
}
