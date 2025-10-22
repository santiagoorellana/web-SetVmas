import { Routes, RouterModule } from '@angular/router';
import { Component, OnInit,OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { first } from 'rxjs/operators';
import { UsuarioService } from '../../services/user/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs/operators';
import { CaptchaComponent } from 'angular-captcha';
import { MustMatch } from '../../_helpers/MustMatch';
import { MenuComponent } from '../../components/common/menu/menu.component';
import { FooterComponent  } from '../../components/common/footer/footer.component';
import { AppComponent } from 'src/app/app.component';
import {LoadingIndicatorService} from '../../services/loading/loading-indicator.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-registry-referred',
  templateUrl: './registry-referred.component.html',
  styleUrls: ['./registry-referred.component.css']
})
export class RegistryReferredComponent implements OnInit {

 

  public id: string;
  public url:string;
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  returnUrl: string;
  error = '';
  hide = true;
  codigo: string;
  captchaComponent: any;
  anfitrion: Usuario;

  private menu:MenuComponent;
  private footer:FooterComponent;

  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: UsuarioService,
    public authenticationService: AuthenticationService,
    public toastr: ToastrService,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public loadingIndicator:LoadingIndicatorService,
    public titleService: Title, 
    public metaService: Meta

   
  ) { }


  ngOnInit( ): void {

    this.titleService.setTitle('Registro de usuarios - Setvmás');
    this.addTags();

this.loadingIndicator.showMe=true;


  this.authenticationService.logout();
 

    this.url=this.router.url;
    var cadena=this.url;
    cadena.lastIndexOf('/');
   
    this.url=cadena.substring(cadena.lastIndexOf('/')+1,cadena.length);
    this.id=this.url;
    this.anfitrion = new Usuario();
    // this.addRecaptchaScript();
     this.registerForm = this.formBuilder.group({
       anfitrion: this.id,
       telefono: ['', Validators.required],
       correo: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.minLength(6)]],
       confirmPassword: ['', Validators.required],
       captcha: ['',[  Validators.required]]
     },
       {
         validator: MustMatch('password', 'confirmPassword')
       });


       localStorage.removeItem("idAnfitrion");
       localStorage.setItem("idAnfitrion", this.id);
    
  }


  addTags(){
    this.metaService.addTag( { name: 'author', content: 'Setvmás' });
    this.metaService.addTag( { name: 'description',content: 'Registro y acceso de usuarios a la red de publicidad' });
    this.metaService.addTag( { name: 'keywords',content: 'registro, login, acceso, emprender, anunciar, comprar, vender, ganar, puntos, anfitrión, referidos, oportunidad, Setvmas, Setv+' });
  }

  

  addRecaptchaScript() {
    window['grecaptchaCallback'] = () => {
      this.renderReCaptcha();
    };

    (function (d, s, id, obj) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));

  }

  renderReCaptcha() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
     //'sitekey': '6LePbq4UAAAAAPqwJU8u5g1Of1TIEMyoPpJQpyaD',
      'sitekey': '6LfI1fcUAAAAAEwQ1Fb86Qkhabye30Y81fMYxsHM',
      'callback': (response) => {


  this.registerForm.controls.captcha.setValue(response);

      }
    });
  }

  sendIdAnfitrion(){

    localStorage.removeItem("idAnfitrion");
    localStorage.setItem("idAnfitrion", this.id);
    localStorage.removeItem("referido");
    this.authenticationService.logout();
  }

 

  onSubmit() {
    this.submitted = true;
   

    // stop here if form is invalid
    // if (this.registerForm.invalid || !Boolean(this.registerForm.controls.captcha.value)) {
    if (this.registerForm.invalid) {
      return;
    }


 this.authenticationService.register(this.registerForm.controls.correo.value, this.registerForm.controls.password.value,
    this.registerForm.controls.anfitrion.value, this.registerForm.controls.telefono.value, this.registerForm.controls.captcha.value )
    .pipe(first())
    .subscribe(
      data => {

        this.toastr.success('Hemos enviado un correo de confirmación. Ábralo y compruebe su registro.' +
        ' Si el correo no aparece en su bandeja de entrada, búsquelo en la carpeta de SPAM', 'Registrarse');

        //  this.dialogRef.close();

        },
        error => {
          this.error = error;
          this.loading = false;

          this.toastr.error('Ya existe un usuario registrado con ese correo','Registrarse');
        });

  this.onReset();
 // window.location.reload(true);

  }

  get f() { return this.registerForm.controls; }

  onReset() {
    this.submitted = false;
  }

resolved(captchaResponse: string) {
  this.registerForm.controls.captcha.setValue(captchaResponse);
}


onCloseClick() {
 // this.dialogRef.close();
//this.addRecaptchaScript();
 window.location.reload(true);
 this.registerForm.reset();
}

/*
@HostListener('window:unload', ['$event'])
beforeunloadHandler(event) {
   localStorage.removeItem("referido");
   let r=localStorage.getItem("referido");
   localStorage.removeItem("normality");
   localStorage.setItem("normality","1");;
}*/



}


