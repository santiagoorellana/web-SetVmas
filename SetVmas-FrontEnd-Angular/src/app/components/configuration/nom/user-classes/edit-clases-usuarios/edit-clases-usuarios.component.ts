import { Component, OnInit } from '@angular/core';
import { ClasesUsuariosService } from '../../../../../services/class-user/clases-usuarios.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-clases-usuarios',
  templateUrl: './edit-clases-usuarios.component.html',
  styleUrls: ['./edit-clases-usuarios.component.css']
})
export class EditClasesUsuariosComponent implements OnInit {

  constructor(public servPag: ClasesUsuariosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const idP = 'id';
    this.servPag.getClasesUsuariosByid(this.route.snapshot.params[idP]);
    console.log(this.servPag);
  }

  salvarCambios() {
    this.servPag.salvarCambios();
  }

  regresar() {
    this.router.navigate(['clasesusuarios']);
  }


}
