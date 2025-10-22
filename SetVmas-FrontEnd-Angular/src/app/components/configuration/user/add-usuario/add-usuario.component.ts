import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../services/user/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClasesUsuariosService } from '../../../../services/class-user/clases-usuarios.service';
import { ClasesUsuariosModel } from '../../../../models/clases-usuarios.model';
import { ConfiguracionesService } from '../../../../services/configuration/configuration.service';
import { J } from '@angular/cdk/keycodes';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';


@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {
  public activo: string="No";
  public bloqueado: string = "No";
  listaClase: string[] = ['Iniciado', 'Bronce', 'Plata', 'Oro', 'Diamante'];
  clase: number = 0;
  listaRoles: string[];

  currentUser: Usuario;

  constructor(public service: UsuarioService, public router: Router,
              public route: ActivatedRoute, public servClase: ClasesUsuariosService,
              private servConf: ConfiguracionesService, private authenticationService: AuthenticationService) {
    this.listaRoles = this.servConf.getRoles();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    const id = 'id';
    this.service.getUsuarioByidV2(this.route.snapshot.params[id])
      .then(res => {
         this.service.formData = res as Usuario;
        this.servClase.getClaseList();
        if (this.service.formData.ClasesUsuarios)
          this.clase = this.service.formData.ClasesUsuarios.ClasesUsuariosId;
        this.activo = this.service.formData.Activo ? "Si" : "No";
        this.bloqueado = this.service.formData.Bloqueado ? "Si" : "No";
        console.log('Clase', this.clase);

      });


  }

  salvarCambios() {

    if (this.activo == "Si")
      this.service.formData.Activo = true;
    else
      this.service.formData.Activo = false;


    if (this.bloqueado == "Si")
      this.service.formData.Bloqueado = true;
    else
      this.service.formData.Bloqueado = false;
    console.log("Activo", this.service.formData.Activo);

    this.service.salvarCambios();
  }
 regresar() {
    this.router.navigate(['usuario']);
  }

}
