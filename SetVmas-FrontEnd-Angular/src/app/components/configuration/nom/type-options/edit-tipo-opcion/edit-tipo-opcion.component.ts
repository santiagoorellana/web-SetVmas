import { Component, OnInit } from '@angular/core';
import {TipoOpcionService} from '../../../../../services/type-option/tipo-opcion.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-tipo-opcion',
  templateUrl: './edit-tipo-opcion.component.html',
  styleUrls: ['./edit-tipo-opcion.component.css']
})
export class EditTipoOpcionComponent implements OnInit {

  constructor(public servTO: TipoOpcionService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const idP = 'id';
    this.servTO.getTipoOpcionsByid(this.route.snapshot.params[idP]);
  }

  salvarCambios() {
    this.servTO.salvarCambios();
  }

  regresar() {
    this.router.navigate(['tipoopcion']);
  }


}
