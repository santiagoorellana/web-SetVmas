import {Component, Inject, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {LoadingIndicatorService} from 'src/app/services/loading/loading-indicator.service';
import { Usuario } from '../../../../../models/usuario.model';
import { Title, Meta } from '@angular/platform-browser';
import {DOCUMENT} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {Overlay} from "@angular/cdk/overlay";
import {ModalLoginComponent} from "../login/login.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.css']
})
export class EmailConfirmComponent implements OnInit {

  confirmarForm: FormGroup ;
  submitted = false;
  loading = false;
  currentUser: Usuario; // login
  constructor( public router: Router,
               public route: ActivatedRoute,
               private authService: AuthenticationService,
               private formBuilder: FormBuilder,
               public loadingIndicator: LoadingIndicatorService,
               public authenticationService: AuthenticationService,
               public titleService: Title,
               public metaService: Meta,
               public dialog: MatDialog,
               @Inject(DOCUMENT) private document: Document, public toastr: ToastrService, private overlay: Overlay) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;


    });}


  ngOnInit() {
    this.titleService.setTitle('Confirmación de email - Setvmás');
    this.addTags();

    this.loadingIndicator.showMe=false;
    this.authenticationService.logout();

    this.confirmarForm = this.formBuilder.group({
      codigo: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.confirmarForm.invalid) {
      //console.log('ERROR', JSON.stringify(this.registerForm.value));
      return;
    }

    this.authService.confirmar(this.confirmarForm.controls.codigo.value) .subscribe( res => {
        console.log('entro');
        var user=res as Usuario;
        if(user.UsuarioId!=0)
        {
          this.toastr.success('Se ha verificado su correo satisfactoriamente.', 'Confirmar Cuenta');
          this.router.navigate(['/']);
          const dialogRef = this.dialog.open(ModalLoginComponent, {
            width: '360px',
            height: 'auto',
          });

          this.document.body.classList.add('noscroll');

          dialogRef.afterClosed().subscribe(result => {
            this.document.body.classList.remove('noscroll');

          });

        }
        else
          this.toastr.error('Su correo ya ha sido verificado.', 'Confirmar Cuenta');


      },
      err => {
        this.toastr.error('Ha existido un error al verificar su cuenta.', 'Confirmar Cuenta');


      }
    );
  }


  addTags() {
    this.metaService.addTag( { name: 'description', content: 'Para verificar el código recibido en el email' });
    this.metaService.addTag( { name: 'keywords', content: 'verificar, confirmar, insertar, email' });
  };

  get f() { return this.confirmarForm.controls; }

}
