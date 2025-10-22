import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
// import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { Categoria } from '../../../../models/categoria.model';
import { CategoriaEtiqueta } from '../../../../models/categoria-etiqueta.model';
import { EtiquetaService } from 'src/app/services/tags/etiqueta.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { CategoryTagsService } from 'src/app/services/category-tags/category-tags.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Etiqueta } from '../../../../models/etiqueta.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.css']
})
export class AddTagComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl();
  filteredCategory: Observable<Categoria[]>;
  categories: Categoria[] = [];
  allCategories: Categoria[] = [];
  @ViewChild('categoryInput', { static: false }) categoryInput: ElementRef;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(public service: EtiquetaService, private router: Router,
    private route: ActivatedRoute, private servCategoria: CategoryService,
    private servCE: CategoryTagsService,  private toastr: ToastrService) {

  }
ngOnInit() {
  const id = 'id';

  this.service.getEtiquetaByid(this.route.snapshot.params[id]);

  // Zuleidy Get Lista de Categorias
  this.servCategoria.getCategoriasAll('Nombre', '', 'asc', 1, 20)
      .then(res => {
        this.allCategories = res as Categoria[];
      });
  //  Zuleidy Get Lista de Categorias
  // this.service.getCategoriaEtiquetaByEtiqueta(this.service.formData.EtiquetaId)
  //   .then(res => {
  //     this.categories = res as Categoria[];
  //   });


  this.filteredCategory = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) => category ? this._filter(category) : this.allCategories));
  // map((category: string | null) => category ? this._filter(category) : this.allCategories.slice()));
}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    // Add our fruit
    if ((value || '').trim() && this.service.formData.Categorias.filter(fruit => fruit.Nombre === value.trim()).length === 0
      && this.allCategories.filter(fruit => fruit.Nombre === value.trim()).length === 0) {

      this.servCategoria.postCategoriaV3(new Categoria(0, value.trim(), null, null, null, 0))
      .then(res=>{
            //this.categories.push(res as Categoria);
            this.allCategories.push(res as Categoria);
            this.service.formData.Categorias.push(res as Categoria);
          });


    }


    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.categoryCtrl.setValue(null);
  }

  remove(category, indx): void {
   // this.categories.splice(indx, 1);
    const index: number = this.service.formData.Categorias.findIndex(d => d === category);
    this.service.formData.Categorias.splice(index, 1);

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    const filterValue = value.Nombre.trim().toLowerCase();

    if (this.service.formData.Categorias.filter(fruit => fruit.Nombre.trim().toLowerCase() === filterValue).length === 0
      && this.allCategories.filter(fruit => fruit.Nombre.trim().toLowerCase() === filterValue).length > 0) {
    //  this.categories.push(value);
      this.service.formData.Categorias.push(value);
     // this.service.formData.CategoriaEtiqueta.push(new CategoriaEtiqueta(this.service.formData.EtiquetaId, (event.option.value as Categoria).CategoriaId));

    }

    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }




  private _filter(value: string): Categoria[] {

    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      this.servCategoria.getCategoriasAll('Nombre', filterValue, 'asc', 1, 20)
          .then(res => {
            this.allCategories = res as Categoria[];
          });
     // return this.allCategories.filter(category => category.Nombre.toLowerCase().includes(filterValue));
      return  this.allCategories;

    }
  }


  //Zuleidy Chip List de Categoria



  regresar() {
    this.router.navigate(['etiqueta']);
  }
salvarCambios() {

  if(this.service.formData.Categorias.length==0)
    this.toastr.error('El campo categorias es obligatorio', 'Etiquetas');
  else
    this.service.salvarCambios();

}

}
