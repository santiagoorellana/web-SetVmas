import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TransferenciaService } from '../../../../services/transfer/transferencia.service';
import { UsuarioService } from '../../../../services/user/usuario.service';
import { Usuario } from '../../../../models/usuario.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { startWith, map } from 'rxjs/operators';
import { TipoTransferencia } from '../../../../models/tipo-transferencia.model';
import { TipoTransferenciaService } from '../../../../services/type-transfers/tipo-transferencia.service';
import { Transferencia } from '../../../../models/transferencia.model';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-transferencia',
  templateUrl: './add-transferencia.component.html',
  styleUrls: ['./add-transferencia.component.css']
})
export class AddTransferenciaComponent implements OnInit {

  userAdmin: Usuario;
  tipoTransf: TipoTransferencia;
  currentUser: Usuario;
  invalid: boolean = true;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  filteredUser: Observable<Usuario[]>;
  users: Usuario[] = [];
  allUsers: Usuario[] = [];
  @ViewChild('categoryInput', { static: false }) userInput: ElementRef;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(public service: TransferenciaService, private router: Router, private route: ActivatedRoute,
    private servU: UsuarioService, private servTT: TipoTransferenciaService,
    public authenticationService: AuthenticationService, private toastr: ToastrService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.filteredUser = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filter(user) : this.allUsers));
    this.servTT.getTipoTransferenciaByCodigo("BONIF_MANUAL").then(res => {
      this.tipoTransf = res as TipoTransferencia;
    });
    this.servU.getUsuarioByCorreo("info@setvmas.com").then(res => {
      this.userAdmin = res as Usuario;
    });

  }

  ngOnInit() {
    const id = 'id';

    this.service.getTransferenciaByid(this.route.snapshot.params[id]);
    this.servU.getUsuarios('FechaCreacion', '', '', '', '', '', '', 'desc', '1', '10', '').subscribe(res => {
      this.allUsers = res as Usuario[];
    });
    this.service.formData.Points = 1;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim() && this.users.filter(fruit => fruit.Correo === value.trim()).length === 0
      && this.allUsers.filter(fruit => fruit.Correo === value.trim()).length > 0) {
      this.users.push(this.allUsers.find(fruit => fruit.Correo === value.trim()));
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.userCtrl.setValue(null);

  }


   remove(user, indx): void {
     this.users.splice(indx, 1);
     if (this.users.length == 0)
       this.invalid = true;
     else
       this.invalid = false;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    const filterValue = value.Correo.trim().toLowerCase();

    if (this.users.filter(fruit => fruit.Correo.trim().toLowerCase() === filterValue).length === 0) {
      this.users.push(event.option.value);
      this.userInput.nativeElement.value = '';
      this.userCtrl.setValue(null);
    }

    if (this.users.length == 0)
      this.invalid = true;
    else
      this.invalid = false;

  }


  private _filter(value: string): Usuario[] {

    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      this.servU.getUsuarios('FechaCreacion', '', filterValue, '', '', '', '', 'desc', '1', '10', '').subscribe(res => {
         this.allUsers = res as Usuario[];
      });
      return this.allUsers;
    //  return this.allUsers.filter(user => user.Correo.toLowerCase().includes(filterValue));

    }
  }
   //Zuleidy Chip List de Usuario

  salvarCambios() {
if ( this.currentUser.Correo!=='info@setvmas.com'){
  this.toastr.error('Usted no puede realizar bonificaciones', 'Transferencia');
return;
}

      for (var i = 0; i < this.users.length; i++) {
        this.users[i].Puntos += this.service.formData.Points;
       this.service.postTransferencia(new Transferencia(0, new Date(), this.service.formData.Points,this.tipoTransf.NombreCodigo, this.currentUser.Correo, this.userAdmin.Correo, this.users[i].Correo));
    }
    this.toastr.success('El valor ha sido insertado correctamente.', 'Transferencia');
   // this.router.navigate(['/admin/transferencias']);

  }

  regresar() {
    this.router.navigate(['transferencia']);
  }





}
