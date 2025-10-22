import { Component, OnInit } from '@angular/core';
import {Usuario} from '../../../../models/usuario.model';
import { Title, Meta } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PaginasEstaticasService} from '../../../../services/static-pages/paginas-estaticas.service';
import {AuthenticationService} from '../../../../services/auth/authentication.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-view-static-pages',
  templateUrl: './view-static-pages.component.html',
  styleUrls: ['./view-static-pages.component.css']
})
export class ViewStaticPagesComponent implements OnInit {

 // currentUser: Usuario;
  contactForm: FormGroup;
  submitted = false;
  paginaactiva;
 /* nombre;
  correo = new FormControl('', [Validators.required, Validators.email]);
  asunto;
  mensaje;*/


  constructor(public servPag: PaginasEstaticasService, private router: Router, private  toastr: ToastrService,
              private actRoute: ActivatedRoute, private authenticationService: AuthenticationService,  private formBuilder: FormBuilder,
              public titleService: Title,public metaService: Meta) {
   // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

  }

  /*getErrorMessage() {
    return this.correo.hasError('required') ? 'Debes introducir un valor' :
      this.correo.hasError('email') ? '* Correo inválido ej: correo@mail.com' :
        '';
  }*/

  ngOnInit() {
   
    const idP = 'id';
    this.paginaactiva = this.actRoute.snapshot.params[idP];
    this.servPag.getPaginasEstaticasByid(this.paginaactiva);

    this.actRoute.paramMap.subscribe((param: ParamMap) => {
      const idP1 = 'id';
      this.paginaactiva = param.get('id');
      this.servPag.getPaginasEstaticasByid(this.paginaactiva);

  
      
    if (this.router.url==='/pagina/2'){
      this.metaService.removeTag("name='description'");
      this.metaService.removeTag("name='keywords'");
      this.titleService.setTitle('Términos y Condiciones - Setvmás');
      this.addTags2();
    }
    if (this.router.url==='/pagina/3'){
      this.router.navigate(['/pagina/3']);

      this.metaService.removeTag("name='description'");
      this.metaService.removeTag("name='keywords'");
      this.titleService.setTitle('Nosotros - Setvmás');
      this.addTags3();
    }
    if (this.router.url==='/pagina/6'){
      this.router.navigate(['/pagina/6']);
      
      this.metaService.removeTag("name='description'");
      this.metaService.removeTag("name='keywords'");
      this.titleService.setTitle('Puntuación - Setvmás');
      this.addTags6();
    }
    if (this.router.url==='/pagina/4'){
      this.router.navigate(['/pagina/4']);
 
      this.metaService.removeTag("name='description'");
      this.metaService.removeTag("name='keywords'");
      this.titleService.setTitle('Preguntas frecuentes - Setvmás');
      this.addTags4();
    }
    if (this.router.url==='/pagina/5'){
      this.router.navigate(['/pagina/5']);

      this.metaService.removeTag("name='description'");
      this.metaService.removeTag("name='keywords'");
      this.titleService.setTitle('Contáctenos - Setvmás');
      this.addTags5();
    }

    this.contactForm = this.formBuilder.group({
      nombre: [''],
      correo: ['', [Validators.required,Validators.email] ],
      asunto: [''],
      mensaje: ['', [Validators.required]],
      captcha: ['',[  Validators.required]]
        });

    });
   
  }

  ngAfterViewInit(){
   // alert(this.router.url);
  }

  get f() { return this.contactForm.controls; }

  enviarCorreo() {
    this.submitted = true;
    // stop here if form is invalid
    // if (this.registerForm.invalid || !Boolean(this.registerForm.controls.captcha.value)) {
    if (this.contactForm.invalid) {
      return;
    }
    this.servPag.enviarCorreo(this.contactForm.controls.nombre.value, this.contactForm.controls.correo.value, this.contactForm.controls.asunto.value, this.contactForm.controls.mensaje.value,this.contactForm.controls.captcha.value).subscribe(
      res => {

        this.toastr.success('Correo enviado correcto', 'Contáctenos');
        this.router.navigate(['/']);
      },
      err => {
        this.toastr.error('Error durante el envío del correo. Inténtelo de nuevo', 'Contáctenos');
      }
    );

  }

  addTags2() {
    this.metaService.addTag( { name: 'author', content:'Setvmás' });
    this.metaService.addTag( { name: 'description', content: 'Términos y condiciones que deben cumplir para utilizar el sistema Setvmas' });
    this.metaService.addTag( { name: 'keywords', content: 'términos, condiciones, reglas, setvmas, publicar, anuncios, clasificados, ganar, puntos, referidos, oportunidad, negocio, cuba, Setv+' });
 };
 addTags3() {
  this.metaService.addTag( { name: 'author', content:'Setvmás' });
  this.metaService.addTag( { name: 'description', content: 'Conozca las ideas, motivaciones, fundamentos y razón de ser del sistema Setvmas y la oportunidad que brinda a los usuarios' });
  this.metaService.addTag( { name: 'keywords', content: 'ideas, motivaciones, fundamentos, principios, oportunidad, utilidad, responsabilidad, emprendedor, publicidad, anuncios, setvmas' });
};
addTags6() {
  this.metaService.addTag( { name: 'author', content:'Setvmás' });
  this.metaService.addTag( { name: 'description', content: 'Descripción del sistema de puntuación de Setvmás' });
  this.metaService.addTag( { name: 'keywords', content: 'acumulado, puntos, bonificaciones, referidos, red, vender, ganar' });
};
addTags4() {
  this.metaService.addTag( { name: 'author', content:'Setvmás' });
  this.metaService.addTag( { name: 'description', content: 'Explicación y aclaración de dudas y preguntas frecuentes sobre el sistema Setvmas y su uso para ver anuncios, publicar, ganar puntos y más' });
  this.metaService.addTag( { name: 'keywords', content: 'ayuda, faq, preguntas, frecuentes, respuestas, explicaciones, aclaraciones, funcionamiento' });
};
addTags5() {
  this.metaService.addTag( { name: 'author', content:'Setvmás' });
  this.metaService.addTag( { name: 'description', content: 'Para contactar directamente al equipo de trabajo y administración de la red de publicidad Setvmas, para anunciar en Cuba' });
  this.metaService.addTag( { name: 'keywords', content: 'contacto, directamente, email, equipo, administración, preguntas' });
};

  Inicio() {
    this.router.navigate(['/']);
  }

  onReset() {
    this.submitted = false;
  }
    resolved(captchaResponse: string) {
        this.contactForm.controls.captcha.setValue(captchaResponse);
    }
}
