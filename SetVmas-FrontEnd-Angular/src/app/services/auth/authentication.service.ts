import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders,HttpParams} from '@angular/common/http';
import {first, map, retry, catchError} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AutoLogoutService } from './auto-logout.service';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionesService } from '../configuration/configuration.service';
import {core} from '@angular/compiler';
import {LoadingIndicatorService} from '../loading/loading-indicator.service';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<Usuario>;
  public currentUser: Observable<Usuario>;
  public currentRol: string;
  listaUsuario: Usuario[] = [];
  readonly rootURL = this.servConfiguracion.getRootURLApi();
  formData = new Usuario();
  anfitrion: number;
  editmode=true;
  Anfitrion: Usuario;
  constructor(public http: HttpClient, private loading: LoadingIndicatorService,
    public servConfiguracion: ConfiguracionesService,
    private router: Router,
    public toastr: ToastrService,
  private actRoute: ActivatedRoute
    //private autoLogoutService: AutoLogoutService
   ) {

    this.currentUserSubject = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('currentUser')));
     this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): Usuario {
    return this.currentUserSubject.value;
  }
  public get inputDisabled() {
    return this.editmode;
  }



  private getCurrentUser(){
    this.http.get<Usuario>(this.rootURL + 'Usuarios/Current')
      .toPromise().then(res => {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.currentUserSubject.next(res);
          this.currentUser.subscribe(x => this.currentRol = x.Rol);
          //localStorage.setItem('lastAction', Date.now().toString());//logout

          var clase = JSON.parse(JSON.stringify(res)).Clase;
          this.getUsuarioById((res as Usuario).UsuarioId).then(user2 => {
            var newClase = JSON.parse(JSON.stringify(user2)).Clase;
            if (clase!=null && clase != newClase)
              this.toastr.success('Felicidades. Usted ha subido al nivel ' + newClase);
          });
        },
        err => {
          this.toastr.error('No existe ningún usuario logueado','Registrarse');
        }
      );
  }

  login(Correo: string, Password: string) {
    // @ts-ignore
    return this.http.post<Usuario>(this.rootURL + 'Usuarios/SingIn',
      { "username":Correo, "password":Password })
      .pipe(map(user => {
        localStorage.setItem('token',JSON.parse(JSON.stringify(user)).token);
        this.getCurrentUser();
        return user;
      }));
  }


  register(Correo: string, Password: string, Anfitrion: string, Telefono:string, Captcha:string ){
    this.loading.showLoading(true);
    const reautenticar: string = localStorage.getItem('reautenticate');
    const userId: string = localStorage.getItem('useraut');
    return this.http.post<Usuario>(this.rootURL + 'Usuarios',{ Correo, Password, Anfitrion, Telefono, Captcha, reautenticar, userId })
      .pipe(
        map(user => {
        this.loading.showLoading(false);
        return user;}),
        catchError((err) => {
          if(err.status == "404")
            this.toastr.error(err.error.ErrorMessage,'Registrarse');
          this.loading.showLoading(false);
          return null;    //Rethrow it back to component
        })
      );
  }




  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('error',errorMessage);
  }

  getUsuarioCodigo(codigo) {
    this.http.get(this.rootURL + 'Usuarios/Codigo/' + codigo).toPromise()
      .then(res => {
        this.anfitrion = (res as Usuario).UsuarioId;
        this.Anfitrion = (res as Usuario);
           },
      err => {
        this.toastr.error('No existe ningún usuario con ese código','Registrarse');
        }
      );
  }
  getUsuarioById(id) {
    return this.http.get(this.rootURL + 'Usuarios/' + id).toPromise();

  }


  getUsuarioList() {
    return this.http.get(this.rootURL + 'Usuarios/List').toPromise()
      .then(res => this.listaUsuario = res as Usuario[]);
  }



  /*confirmar(codigo: string) {

    return this.http.get(this.rootURL + 'Usuarios/Confirmar/' + codigo).toPromise()
           .then( res => {
                console.log('entro');
                var user=res as Usuario;
                if(user.UsuarioId!=0)
                {
                    this.toastr.success('Se ha verificado su correo satisfactoriamente.', 'Confirmar Cuenta');
                   // this.router.navigate(['/']);
                }
                else
                    this.toastr.error('Su correo ya ha sido verificado.', 'Confirmar Cuenta');


        },
            err => {
          this.toastr.error('Ha existido un error al verificar su cuenta.', 'Confirmar Cuenta');
        }
    );

  }*/



    confirmar(codigo: string) {

        return this.http.get(this.rootURL + 'Usuarios/Confirmar/' + codigo)
           ;


    }


    recuperar(correo) {

    return this.http.get(this.rootURL + 'Usuarios/Recuperar/' + correo).subscribe(
      res => {

          this.formData = (res as Usuario);
          this.toastr.success('Ud ha recibido un correo con su nueva contraseña', 'Recuperar cuenta');

      },
        err => {

          this.toastr.error('No existe ningún usuario registrado con ese correo.', 'Recuperar cuenta');
        }
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  isUserLoggedIn() {

   // let user = sessionStorage.getItem('username')
    return !(this.currentUser === null)
  }

  isAdmin() {

    // let user = sessionStorage.getItem('username')
    return (this.currentRol === "Administrador")
  }
  getRol() {

    // let user = sessionStorage.getItem('username')
    return this.currentRol;
  }





}
