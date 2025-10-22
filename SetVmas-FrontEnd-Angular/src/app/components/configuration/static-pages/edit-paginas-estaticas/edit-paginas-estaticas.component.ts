import { Component, OnInit } from '@angular/core';
import { PaginasEstaticasService } from '../../../../services/static-pages/paginas-estaticas.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-paginas-estaticas',
  templateUrl: './edit-paginas-estaticas.component.html',
  styleUrls: ['./edit-paginas-estaticas.component.css']
})
export class EditPaginasEstaticasComponent implements OnInit {

  constructor(public servPag: PaginasEstaticasService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const idP = 'id';
    this.servPag.getPaginasEstaticasByid(this.route.snapshot.params[idP]);
  }

  salvarCambios() {
    this.servPag.salvarCambios();
  }

  regresar() {
    this.router.navigate(['paginasestaticas']);
  }


}
