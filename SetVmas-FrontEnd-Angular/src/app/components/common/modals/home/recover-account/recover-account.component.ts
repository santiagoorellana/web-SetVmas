import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
// import { ModalLoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { ModalRegisterComponent } from '../register/register.component';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.component.html',
  styleUrls: ['./recover-account.component.css']
})

export class ModalRecoverAccountComponent implements OnInit {

  recuperarForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(public dialogRef: MatDialogRef<ModalRecoverAccountComponent>,
              public dialog: MatDialog,
              @Inject(DOCUMENT) private document: Document,
              public route: ActivatedRoute,
              public router: Router,
              public authenticationService: AuthenticationService,
              public toastr: ToastrService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.recuperarForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.recuperarForm.invalid) {
      //console.log('ERROR', JSON.stringify(this.registerForm.value));
      return;
    }

    // display form values on success
    //console.log('SUCCESS', JSON.stringify(this.registerForm.value));

    this.authenticationService.recuperar(this.recuperarForm.controls.correo.value);
    this.dialogRef.close();
  }

  get f() { return this.recuperarForm.controls; }

  onCloseClick(): void {
    this.dialogRef.close();
    // this.openDialogLogin();
  }

  // openDialogLogin(): void {
  //   const dialogRef = this.dialog.open(ModalLoginComponent, {
  //     width: '360px',
  //     height: 'auto',
  //   });

  //   this.document.body.classList.add('noscroll');

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.document.body.classList.remove('noscroll');
  //   });
  // }

  openDialogRegister(): void {
    this.dialogRef.close();
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
