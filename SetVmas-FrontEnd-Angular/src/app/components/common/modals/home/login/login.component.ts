import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../../../services/auth/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {AutoLogoutService} from '../../../../../services/auth/auto-logout.service';
import {first} from 'rxjs/operators';
import {LoadingIndicatorService} from '../../../../../services/loading/loading-indicator.service';
import { ModalRecoverAccountComponent } from '../recover-account/recover-account.component';
import { DOCUMENT } from '@angular/common';
import { ModalRegisterComponent } from '../register/register.component';



@Component({
  selector: 'app-modal-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class ModalLoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  hide = true;
  //email = new FormControl('', [Validators.required, Validators.email]);
  email = new FormControl('', [Validators.required]);
  pass = new FormControl('', [Validators.required]);


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastr: ToastrService,
    public iconRegistry: MatIconRegistry, public sanitizer: DomSanitizer,
    private autoLogoutService: AutoLogoutService,
    public dialogRef: MatDialogRef<ModalLoginComponent>,
    public dialog: MatDialog, private  loadingIndicator: LoadingIndicatorService,
    @Inject(DOCUMENT) private document: Document
    )
  {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);

    }
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    localStorage.setItem('lastAction', Date.now().toString());//logout
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'Debes introducir un valor' :
      this.email.hasError('email') ? 'No es un email válido' :
        '';
  }

  getErrorPassMessage() {
    return this.pass.hasError('required') ? 'Debes introducir un valor' : '';
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    //if (this.loginForm.invalid) {
    //  return;
    //}

    this.loading = true;
    //this.loadingIndicator.showLoading(true);
    this.authenticationService.login(this.email.value, this.pass.value)
      .subscribe(
        data => {
          //   this.router.navigate([this.returnUrl]);
          this.dialogRef.close();
          this.loadingIndicator.showLoading(false);
        },
        error => {
          this.error = error;
          this.loading = false;
          this.toastr.error('Verifique que los datos sean correctos','Autenticarse');
        });
  }
  singup() {
    // this.dialogRef.close();
    // const dialogRef = this.dialog.open(SingunComponent, {
    //   width: '800px', height: '480px'
    // });
    //this.router.navigate(['/singup']);
  }

  recuperar() {
    // this.dialogRef.close();
    // const dialogRef = this.dialog.open(RecuperarCuentaComponent, {
    //   width: '400px', height: '400px'
    // });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  openDialogRecoverAccount(): void {
    this.onCloseClick();
    const dialogRef = this.dialog.open(ModalRecoverAccountComponent, {
      width: '360px',
      height: 'auto',
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
    });
  }

  public restrictValue(e) {
    let input;
  
   //si escribo espacio
   if (e.which === 32) {
    return false;
   }

  
   }

  openDialogRegister(): void {
    this.onCloseClick();
    const dialogRef = this.dialog.open(ModalRegisterComponent, {
      width: '800px',
      height: 'auto',
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
    });
  }
}
