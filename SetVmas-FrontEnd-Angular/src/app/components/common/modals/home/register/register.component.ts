import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { first } from 'rxjs/operators';
import { UsuarioService } from '../../../../../services/user/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from '../../../../../models/usuario.model';
import { map } from 'rxjs/operators';
import { CaptchaComponent } from 'angular-captcha';
import { MustMatch } from '../../../../../_helpers/MustMatch';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class ModalRegisterComponent implements OnInit {

  idAnf:string;
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  returnUrl: string;
  error = '';
  hide = true;
  hide1 = true;
  hide2 = true;
  oculta : boolean;
  codigo: string;
  captchaComponent: any;
  anfitrion: Usuario;
  chieldm= true;
  an:string;
  isCartel:boolean;
  co:string;
  pa:string;
  te:string;
  cart:string;
  oldemail:string;
  isHidden: boolean=true;
  actual:string;

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
    public dialogRef: MatDialogRef<ModalRegisterComponent>,
    public titleService: Title,
    public metaService: Meta
    ) { }


    ngOnInit() {

      this.an='';
      this.co='';
      this.pa='';
      this.te='';

       this.cart= localStorage.getItem("Reau");

      if (this.cart=='1'){
        this.isCartel=true;
        localStorage.removeItem("Reau");
      }else{
        this.cart=='0';
        localStorage.removeItem("Reau");
        this.isCartel=false;
      }
      this.titleService.setTitle('Registro de usuarios - Setvmás');
      this.addTags();

      this.an='';
      this.co='';
      this.pa='';
      this.te='';


      let reautentiation = localStorage.getItem("reautenticate");

      if (reautentiation != null){
        this.isHidden= false;
        //this.oldemail=
        this.an=localStorage.getItem("anfit");
        this.idAnf=this.an;
        this.co=localStorage.getItem("corr");
        this.pa=localStorage.getItem("pass");
        this.te=localStorage.getItem("tel");


        } else{
          this.co='';
          this.pa='';
          this.te='';

        }



      let AnfitrionId = localStorage.getItem("idAnfitrion");



      if (AnfitrionId == null){
        this.idAnf='';
       // alert('no existe');

       this.isHidden= true;

       this.chieldm= true;

        localStorage.removeItem("idAnfitrion");


        }else
      {
        this.idAnf=AnfitrionId;
       // alert('existe');

       this.chieldm= false;

        localStorage.removeItem("idAnfitrion");
      //  this._isDisabled=true;
      }


  this.anfitrion = new Usuario();
     // this.addRecaptchaScript();
      this.registerForm = this.formBuilder.group({
        anfitrion:this.idAnf,
        telefono: ['', Validators.required],//[this.te, Validators.required],
        correo: ['', [Validators.required, Validators.email]],//[this.co, [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],// [this.pa, [Validators.required, Validators.minLength(6)]],
        confirmPassword:['', Validators.required],// [this.pa, Validators.required],
        captcha: ['',[  Validators.required]]
      },
        {
          validator: MustMatch('password', 'confirmPassword')
        });
    }

    addTags(){
      this.metaService.addTag( { name: 'author', content: 'Setvmás' });
      this.metaService.addTag( { name: 'description',content: 'Registro y acceso de usuarios a la red de publicidad' });
      this.metaService.addTag( { name: 'keywords',content: 'registro, login, acceso, emprender, anunciar, comprar, vender, ganar, puntos, anfitrión, referidos, oportunidad, Setvmas, Setv+' });
    }


  onCloseClick() {
    this.dialogRef.close();
    localStorage.removeItem("idAnfitrion");
    localStorage.removeItem("reautenticate");
    localStorage.removeItem("corr");
    localStorage.removeItem("pass");
    localStorage.removeItem("tel");
    this.chieldm= true;
    this.actual='';
    this.actual='Correo';
  // this.addRecaptchaScript();
 // window.location.reload(true);
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

  onSubmit() {

    if (this.co!=''){
     if (this.registerForm.value.correo==this.co){
      this.submitted = false;
     // this.toastr.error('Debe modificar el email para que todos los cambios sean efectivos','Registrarse');
      this.dialogRef.close();
     }
    }

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

             this.toastr.success('Hemos enviado un correo de confirmación. Ábralo y compruebe su registro. ' +
               ' Si el correo no aparece en su bandeja de entrada, búsquelo en la carpeta de SPAM', 'Registrarse');

             this.dialogRef.close();
             this.idAnf='';

           },
           error => {
             this.error = error;
             this.loading = false;

             //this.toastr.error('Ya existe un usuario registrado con ese correo','Registrarse');
           });

  this.onReset();
 // window.location.reload(true);

  }

  get f() { return this.registerForm.controls; }



  onReset() {
    this.submitted = false;
  }

resolved(captchaResponse: string) {
/*if (this.co!=''){
  if (this.registerForm.value.correo!=this.co){
    this.registerForm.controls.captcha.setValue(captchaResponse);
  }else{
    this.submitted=false;
    this.toastr.error('Debe modificar el email para que todos los cambios sean efectivos','Registrarse');
    this.dialogRef.close();

  }

}*/
  this.registerForm.controls.captcha.setValue(captchaResponse);
}
}
