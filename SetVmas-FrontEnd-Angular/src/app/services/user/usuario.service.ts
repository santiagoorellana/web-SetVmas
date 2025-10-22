import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ClasesUsuariosModel } from '../../models/clases-usuarios.model';
// import { AuthenticationService } from '../../../auth/services/authentication.service';
import { Usuario } from '../../models/usuario.model';
import { ConfiguracionesService } from '../configuration/configuration.service';
import { ClasesUsuariosService } from '../class-user/clases-usuarios.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 // formData = new Usuario(0, '', '', '', '', '', false, false, 0, null, null, new ClasesUsuariosModel(0, '', 0, 0, 0, 0, 0, 0), '',0);
  formData = new Usuario();
  listaUsuario: Usuario[] = [];
  resultsLength = 0;
    pageIndex=1;
    pageSize=10;

    readonly rootURL = this.servConfiguracion.getRootURLApi();
  tableColumns: string[] = ['select', 'UsuarioId', 'Codigo', 'Correo', 'Telefono', 'ClasesUsuarios', 'Rol', 'Puntos', 'Activo', 'Bloqueado', 'FechaCreacion','FechaUltimaEntrada','Acciones'];
  dataSource = new MatTableDataSource<Usuario>(this.listaUsuario);
  currentUser: Usuario;
  // constructor(public http: HttpClient, public servConfiguracion: ConfiguracionesService, public router: Router,
  //   public toastr: ToastrService, private authenticationService: AuthenticationService) {
  //   this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  // }
    constructor(public http: HttpClient, public servConfiguracion: ConfiguracionesService, public router: Router,
    public toastr: ToastrService) {
    // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

  }
  refrechForm() {

    this.formData.UsuarioId=0;
    this.formData.Codigo='';
    this.formData.Correo = '';
    this.formData.Password = '';
    this.formData.Rol = '';
    this.formData.Telefono = '';

    this.formData.Activo= false;
    this.formData.Bloqueado=false;
    this.formData.Puntos=0;

    this.formData.FechaCreacion= null;
    this.formData.FechaUltimaEntrada= null;
    this.formData.Anfitrion =null;

    this.formData.ClasesUsuarios = new ClasesUsuariosModel(0, '', 0, 0, 0, 0, 0, 0,0);


  }

  getUsuarios(col, rol, correo, clase, puntos, diasInactividad, fechaCreacion, sortDirection,  pageIndex, pageSize, codigo) {
    return this.http.get(this.rootURL + 'Usuarios', {
      params: new HttpParams()
        .set('col', col.toString())
        .set('rol', rol)
        .set('correo', correo)
        .set('clase', clase)
        .set('puntos', puntos)
        .set('diasInactividad', diasInactividad)
        .set('fechaCreacion', fechaCreacion)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('codigo', codigo.toString())
    }).pipe(
      // map(res => {})
    );
  }

   getUsuarioCount() {
    this.http.get(this.rootURL + 'Usuarios/Count').subscribe((res) => { this.resultsLength = (res as number); });
  }


  getUsuarioByid(id) {
    if (+id === 0) {
      //return this.formData = new Usuario(0, '', '', '', '', '', false, false, 0, null, null, new ClasesUsuariosModel(0,'',0,0,0,0,0,0,), '',0);
      return this.formData = new Usuario();
    }

    return this.http.get(this.rootURL + 'Usuarios/' + id).toPromise()
      .then(res => this.formData = res as Usuario);
  }

  getUsuarioByidV2(id) {
    /*if (+id === 0) {
      //return this.formData = new Usuario(0, '', '', '', '', '', false, false, 0, null, null, new ClasesUsuariosModel(0,'',0,0,0,0,0,0,), '',0);
      return this.formData = new Usuario();
    }*/

    return this.http.get(this.rootURL + 'Usuarios/' + id).toPromise()
      ;
  }

 getUsuarioByCodigo(codigo) {


   return this.http.get(this.rootURL + 'Usuarios/Codigo/' + codigo).toPromise()
     .then(res => this.formData = res as Usuario);
  }


  getUsuarioByCorreo(correo) {

    return this.http.get(this.rootURL + 'Usuarios/Correo/' + correo).toPromise();
  }

  //getUsuarioByCodigo(codigo) {
  //  if (+codigo === 0) {
  //    //return this.formData = new Usuario(0, '', '', '', '', '', false, false, 0, null, null, new ClasesUsuariosModel(0,'',0,0,0,0,0,0,), '',0);
  //    return this.formData = new Usuario();
  //  }
  //  return this.http.get(this.rootURL + 'Usuarios/Codigo' + codigo).toPromise()
  //    .then(res => this.formData = res as Usuario);
  //}


  salvarCambios() {
    if (this.formData.UsuarioId === 0) {
      this.postUsuario();
    } else {
      this.putUsuario();
    }
  // this.getUsuarios('FechaCreacion', '', 'asc', '1', '10');
  //  this.router.navigate(['usuario']);

  }

  postUsuario() {
    this.http.post(this.rootURL + 'Usuarios', this.formData).subscribe(
      res => {

        this.getUsuarios('FechaCreacion', '', '', '', '', '', '', 'asc', this.pageIndex, this.pageSize, '');
        this.router.navigate(['admin/usuarios']);
        this.toastr.success('Se insertó correctamente', 'Usuario');
      },
      err => {
        this.toastr.error('Error durante la inserción', 'Usuario');

      }
    );
  }
  putUsuario() {
    console.log('Usuario', this.formData);
    this.http.put(this.rootURL + 'Usuarios/' + this.formData.UsuarioId, this.formData).subscribe(
      res => {
        this.router.navigate(['admin/usuarios']);
        this.getUsuarios('FechaCreacion', '', '', '', '', '', '', 'asc', this.pageIndex, this.pageSize, '');
        this.toastr.success('Se actualizó correctamente', 'Usuario');

      },
      err => {
        this.toastr.error('Error durante la actualización', 'Usuario');
      }
    );
  }

  putUsuarioSinListar() {
    console.log('Usuario', this.formData);
    this.http.put(this.rootURL + 'Usuarios/' + this.formData.UsuarioId, this.formData).subscribe(
      res => {

        this.toastr.success('Se actualizó correctamente', 'Usuario');

      },
      err => {
        this.toastr.error('Error durante la actualización', 'Usuario');
      }
    );
  }


  deleteUsuarios(id, dataSource) {
    this.http.delete(this.rootURL + 'Usuarios/' + id).subscribe(
      res => {
        this.router.navigate(['/admin/usuarios']);
        dataSource.loadUsuarios('Correo', '', '', '', '', '', '', 'asc', this.pageIndex, this.pageSize);

      },
      err => {
        console.log('Error durante la eliminación');
      }
    );
  }
  /**
   *Metodo para actualizar usuario en la oficina virtual
   * */
  putUsuarioV2(user: Usuario) {

    return this.http.put(this.rootURL + 'Usuarios/' + user.UsuarioId, user).toPromise();
  }

  /**
  *Metodo para actualizar usuario en la oficina virtual by @SanPanda
* */
  putUsuarioV3(user: Usuario) {

    return this.http.post(this.rootURL + 'Usuarios/OficinaUpdateUser/' + user.UsuarioId, user).toPromise();
  }

  /**
   * Metodo obtenr un usuario por codigo
   * se hizo para la oficina virtual
   * @param codigo
   */
  getUsuarioByCodigoV2(codigo) {


    return this.http.get(this.rootURL + 'Usuarios/Codigo/' + codigo).toPromise();

  }
  /**
   * para saber el volummen de compras hechas por un usuario
   * @param id
   */
  getUsuarioVolumenCompraByUser(id) {


    return this.http.get(this.rootURL + 'Usuarios/VolumenCompras/' + id).toPromise();

  }
}
