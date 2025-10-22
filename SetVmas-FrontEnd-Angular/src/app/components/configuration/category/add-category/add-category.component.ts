import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EtiquetaService } from '../../../../services/tags/etiqueta.service';
import { Etiqueta } from '../../../../models/etiqueta.model';
import { CategoryTagsService } from '../../../../services/category-tags/category-tags.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ConfiguracionesService } from '../../../../services/configuration/configuration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  events: string[] = [];
  private srcResult = '';
  // ********Chip List*******************
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<Etiqueta[]>;
    imagen: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';


  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  // ********Chip List*******************

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;


constructor(public service: CategoryService, private router: Router,
    private route: ActivatedRoute, public servEtiqueta: EtiquetaService,
    public servCE: CategoryTagsService,private servCo: ConfiguracionesService,  private toastr: ToastrService) {

    //********Chip List*******************
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.service.allFruits));
    //********Chip List*******************
  }


  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }


  ngOnInit() {
      const id = 'id';
    this.service.getCategoriaById(this.route.snapshot.params[id]);
   // this.service.getListaEtiquetas();
   /* if  (this.route.snapshot.params[id] != 0 && this.route.snapshot.params[id] != undefined)
      this.service.getCategoriaEtiquetaById(this.route.snapshot.params[id]);*/
  this.service.formData.Etiquetas=[];
  this.servEtiqueta.getEtiquetasAll('CantUsada', '', 'desc', 1, 20)
      .then(res => {
        this.service.allFruits = res as Etiqueta[];
      });
  }

  regresar() {
    this.router.navigate(['categoria']);
    this.fruitCtrl.reset();
  }
  // *******************Chip List*************************


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim() && this.service.formData.Etiquetas.filter(fruit => fruit.Nombre === value.trim()).length === 0
      && this.service.allFruits.filter(fruit => fruit.Nombre === value.trim()).length === 0) {

     /* this.servEtiqueta.formData = new Etiqueta(0, value.trim(), 0, null,[]);
      this.servEtiqueta.postEtiqueta();*/


      this.servEtiqueta.postEtiquetaV2( new Etiqueta(0, value.trim(), 0, true,[]))
          .then(res =>{
            var eti=res as Etiqueta;
           // this.service.fruits.push(eti);
            this.service.allFruits.push(eti);
            this.service.formData.Etiquetas.push(eti);
      });

    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }


  remove(fruit, indx): void {

/*const etiq = this.service.fruits.splice(indx, 1)[0];
const index = this.service.formData.Etiquetas.findIndex(eti => eti.Nombre === etiq.Nombre);
this.service.formData.Etiquetas.splice(index, 1);*/
  const index = this.service.formData.Etiquetas.findIndex(eti => eti.Nombre === fruit.Nombre);
this.service.formData.Etiquetas.splice(index, 1);
  }

getUrlImage(name, container){
  if(name)
    return this.servCo.getSiteUrl() + container + "/" + encodeURI(name);
  else
    return "";
}

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;

   // Add our fruit
    if (this.service.formData.Etiquetas.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length === 0
      && this.service.allFruits.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length > 0) {
     this.service.formData.Etiquetas.push(value);
      //this.service.fruits.push(value);
    }


    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);

  }

  private _filter(value: string): Etiqueta[] {
    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      this.servEtiqueta.getEtiquetasAll('CantUsada', filterValue , 'desc', 1, 20)
          .then(res => {
            this.service.allFruits  = res as Etiqueta[];
          });
      return this.service.allFruits ;
    //  return this.service.allFruits.filter(fruit => fruit.Nombre.toLowerCase().includes(filterValue));
    }
  }

  //onFileSelected() {

  //  const inputNode: any = document.querySelector('#file');

  //  if (typeof (FileReader) !== 'undefined') {
  //    const reader = new FileReader();

  //    reader.onload = (e: any) => {
  //      this.srcResult = e.target.result;


  //      const image = new Image();

  //      image.onload = function () {
  //        const canvas = document.createElement('canvas');
  //        const context = canvas.getContext('2d');
  //        canvas.width = 50;
  //        canvas.height = 50;
  //        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
  //      };

  //      image.src = reader.result.toString();

  //      // this.service.formData.ImageContent = btoa(this.srcResult);
  //      this.service.formData.ImageContent = image.src;


  //    };
  //    console.log('IMAGEN1', inputNode);
  //    reader.readAsBinaryString(inputNode.files[0]);
  //    this.service.formData.ImageMimeType = inputNode.files[0].type;
  //    this.service.formData.ImageName = inputNode.files[0].name;
  //    console.log('IMAGEN', inputNode.files[0]);




  //  }
  //}

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    const reader = new FileReader();
    reader.readAsDataURL(inputNode.files[0]);

    reader.onload = (_event) => {

      const image = new Image();

      image.onload = function () {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
      };

      image.src = reader.result.toString();
      //this.service.formData.Imagen = image.src;

      this.service.formData.ImageMimeType = inputNode.files[0].type;
      this.service.formData.ImageName = inputNode.files[0].name;
      this.service.formData.ImageContent = image.src.split(',', 2)[1];
        this.imagen = 'data:' + this.service.formData.ImageMimeType + ';base64,' + this.service.formData.ImageContent;
    };
  }

salvarCambios() {

if(this.service.formData.Etiquetas.length==0)
  this.toastr.error('El campo etiquetas es obligatorio', 'Categorias');
  else
  this.service.salvarCambios();

}

}
