import {AfterContentInit, AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Usuario} from '../../../models/usuario.model';
import {AnunciosModel} from '../../../models/anuncios.model';
import {BehaviorSubject, Observable, Observer, Subject} from 'rxjs';
import {Categoria} from '../../../models/categoria.model';
import {FormControl} from '@angular/forms';
import {ProvinciasModel} from '../../../models/provincias.model';
import {MunicipiosModel} from '../../../models/municipios.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Etiqueta} from '../../../models/etiqueta.model';
import {VariableConfiguracion} from '../../../models/variable-configuracion.model';
import {BuscarAnunciosModel} from '../../../models/buscar-anuncio.model';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import {AnunciosService} from '../../../services/announcement/announcement.service';
import {MatDialog} from '@angular/material/dialog';
import {DOCUMENT} from '@angular/common';
// import {Overlay} from 'ngx-toastr';
import {CategoryService} from '../../../services/category/category.service';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';
import {TransferenciaService} from '../../../services/transfer/transferencia.service';
import {UsuarioService} from '../../../services/user/usuario.service';
import {BuscarAnunciosService} from '../../../services/announcement/search-ad.service';
import {Router} from '@angular/router';
import {TipoTransferenciaService} from '../../../services/transfer/type-transfer.service';
import {map, startWith,takeUntil} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material/chips';
import {AnuncioetiquetaModel} from '../../../models/anuncioetiqueta.model';
import {MatOptionSelectionChange} from '@angular/material/core';
import {LoadingIndicatorService} from '../../../services/loading/loading-indicator.service';
import { EditarAnunciosComponent } from '../modals/advert/editar-anuncios/editar-anuncios.component';
import { Overlay } from '@angular/cdk/overlay';
import {DetailAdvertComponent} from '../detail-advert/detail-advert.component';
import {HttpParams} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import { Title, Meta } from '@angular/platform-browser';
// import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { VariableConfiguracionService } from '../../../services/variable/variable-configuracion.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, AfterViewInit, OnDestroy {

  public finalize = new Subject();

  // tslint:disable-next-line:no-input-rename
  @Input('mostrarSiempreResultados') mostrarResultados: boolean;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  currentUser: Usuario;

  fecha: string;


  ListaAnuncios: AnunciosModel[];
  txtBuscar: string;
  txtBuscarAvan: string;
  // *****************AutoCompletar Categorias*******************************************************************
  ListaCategoriaFiltradas: Observable<Categoria[]>;
  ListaCategoria: Categoria[];
  inputCat = new FormControl();
  // ************************************************************************************************************
  // *****************AutoCompletar Accion*******************************************************************
  ListaAccionFiltradas: Observable<string[]>;
  ListaAcciones: string[];
  inputAcc = new FormControl();
  // ************************************************************************************************************

  // *****************AutoCompletar Provincia*******************************************************************
  ListaProvFiltradas: Observable<ProvinciasModel[]>;
  ListaProv: ProvinciasModel[];
  inputProv = new FormControl();
  // ************************************************************************************************************

  // *****************AutoCompletar Municipio*******************************************************************
  ListaMunFiltradas: Observable<MunicipiosModel[]>;
  ListaMun: MunicipiosModel[];
  inputMun = new FormControl();
  // ************************************************************************************************************



  // ********Chip List*******************
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputEtq = new FormControl();
  ListaEtiFilter: Observable<Etiqueta[]>;
  ListaEti: Etiqueta[] = [];
  ListaEtiFuente: Etiqueta[];

cantAnunciar:boolean=true;

  @ViewChild('etiquInp', { static: false }) etiquInp: ElementRef<HTMLInputElement>;
  @ViewChild('auto2', { static: false }) matAutocomplete2: MatAutocomplete;
  @ViewChild('auto3', { static: false }) matAutocomplete3: MatAutocomplete;
  @ViewChild('auto4', { static: false }) matAutocomplete4: MatAutocomplete;
  // ********Chip List*******************

  gridByBreakpoint = {
    xl: 4,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1
  }

  dataSource;
  filtroReciente = true;
  filtroMasVisto = false;
  filtroAva = false;
  totalPaginas = this.servCo.getCantPorPaginasHome();
  pagActual = 1;
  cantPorPagina = this.servCo.getCantPorPaginasHome();
  aplicarfiltros = false;
  buscarAnuncio: BuscarAnunciosModel = new BuscarAnunciosModel();
  cantColumnas = 4;
  mostrarMasCamposBusq = false;
  // ***************************Cargando Anuncios***************************************************
 // private loadingAnuncio = new BehaviorSubject<boolean>(false);
 // public loading$ = this.loadingAnuncio.asObservable();

  // ************************************************************************************************


  constructor(public authenticationService: AuthenticationService,public domSanitizer: DomSanitizer,
              private servAnuncio: AnunciosService, public dialog: MatDialog, private overlay: Overlay,
              @Inject(DOCUMENT) public document: Document, private servCategoria: CategoryService,
              private servCo: ConfiguracionesService, private servT: TransferenciaService,
              private servTT: TipoTransferenciaService, private servU: UsuarioService,
              private service: BuscarAnunciosService, private router: Router,
              private loadingIndicator: LoadingIndicatorService, public toastr: ToastrService,
               private serviceVC: VariableConfiguracionService,
               public titleService: Title,
               public metaService: Meta

               ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    // this.fecha = this.currentUser.FechaCreacion.toString("dd-MM-yyyy");
  }

  
  stringTags(tags):string {
    var cadena="";
    for(let i=0; i<tags.length-1; i++){

      cadena=cadena+tags[i].Nombre+", ";
    };
    cadena+=tags[tags.length-1].Nombre;
    if(cadena.length>35)
      return cadena.substr(0,35)+"...";
    else
      return cadena;
   
  }

  url:any;
  private base64data: string | ArrayBuffer;

  ngOnInit() {
    this.addTags();

   // this.loadingAnuncio.next(true);
   //this.loadingIndicator.showLoading(true);

    // if (window.innerWidth <= 1300 && window.innerWidth > 1060) {
    //   this.cantColumnas = 3;
    // } else if (window.innerWidth <= 1060 && window.innerWidth > 628) {
    //   this.cantColumnas = 2;
    // } else if (window.innerWidth <= 628) {
    //   this.cantColumnas = 1;
    // } else {
    //   this.cantColumnas = 4;
    // }

    if(window.innerWidth >= 1280)
      this.cantColumnas = 4;
    else if (window.innerWidth >= 720 && window.innerWidth < 1280)
      this.cantColumnas = 3;
    else if (window.innerWidth >= 480 && window.innerWidth < 720)
      this.cantColumnas = 2;
    else
      this.cantColumnas = 1;

    this.txtBuscar = '';
    this.txtBuscarAvan = '';

    this.buscarAnuncio.ListaEtiquetas = [];

  this.service.updateAnuncioReciente.next(true);//Zuleidy



    //Zuleidy capturar el evento del observable de lsita de anuncios
  this.service.updateAnuncioReciente
      .pipe(takeUntil(this.finalize))
      .subscribe(res => {
if(res)
{

  //this.servAnuncio.insertoAnuncio.next(false);
      this.loadingIndicator.showLoading(true);
      this.ListaAnuncios = null;
      this.filtroReciente = true;
      this.pagActual = 1;
      this.filtroMasVisto = false;
      this.filtroAva = false;

      this.servAnuncio.buscarAnunciosRecientes('FechaCreacion', '', 'asc', 1, this.cantPorPagina)
        .then((res) => {
            this.loadingIndicator.showLoading(false);
            this.ListaAnuncios = res as AnunciosModel[];


            for (const i of (this.ListaAnuncios as AnunciosModel[])) {
              if (i.IsWeb) {
                if (!String.prototype.startsWith('http://', 0) && !String.prototype.startsWith('https://', 0) ) {
                  i.Url = 'http://' + i.Url;
                }
              }
            }
           /* for (const i of (this.ListaAnuncios as AnunciosModel[])) {
              if (i.ImageContent !== undefined && i.ImageContent !== null) {
                i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              } else {
                i.Imagen =  'data:' + i.Categoria.ImageMimeType + ';base64,' + i.Categoria.ImageContent;;
              }
            }*/
          },
          () => {
          //  this.loadingAnuncio.next(false);
            this.loadingIndicator.showLoading(false);
          }
          );
}
    });
    //Zuleidy capturar el evento del observable de lsita de anuncios




    this.servCategoria.getCategoriasAll('', '', 'asc', 1, 5000).then(res => this.ListaCategoria = res as Categoria[]);
    this.servCategoria.getEtiquetasByCategoria(0).then(res => this.ListaEtiFuente = res as Etiqueta[]);
    this.ListaAcciones = this.servCo.getAccionesAnuncio();
    this.servAnuncio.getAnunciosCountV2('', '', 'asc', 1, 5000, 'r').
    then(res => this.totalPaginas = Math.ceil((res as number) / this.cantPorPagina));
    this.ListaProv = this.servCo.getProviciasAll();
    this.ListaMun = this.ListaProv[0].Municipios;
    this.ListaCategoriaFiltradas = this.inputCat.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCategorias(value))
      );
    this.ListaAccionFiltradas = this.inputAcc.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterAcciones(value))
      );
    // ********Chip List*******************
    this.ListaEtiFilter = this.inputEtq.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filterEtiqueta(fruit) : this.ListaEtiFuente));
    // ********Chip List*******************
    this.ListaProvFiltradas = this.inputProv.valueChanges
      .pipe(
        startWith(''),
        map((value) => this._filterProvincias(value))
      );
    this.ListaMunFiltradas = this.inputMun.valueChanges
      .pipe(
        startWith(''),
        map((value) => this._filterMunicipios(value)
        )
      );

    this.filtroReciente = true;
    this.filtroMasVisto = false;
    this.filtroAva = false;

  if(this.currentUser==null)
  {    this.serviceVC.getVariableConfiguracionByCodigo("Invitado_Anunciar")
      .then(res => {
        if((res as VariableConfiguracion).Valor=='true')
        this.cantAnunciar=true;
        else
        this.cantAnunciar=false;
      });
  }


}

  copyLink($event,idAnuncio):void {
    $event.stopPropagation();
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.servCo.getUrlRootSite() + "detalles-anuncio/" + idAnuncio;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success('Enlace copiado al portapapeles.');

  }

  addTags(){
    this.metaService.addTag( { name: 'author', content: 'Setvmás' });
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  private _filterCategorias(value: string): Categoria[] {
    const filterValue = value.toLowerCase();
    return this.ListaCategoria.filter(option => option.Nombre.toLowerCase().includes(filterValue));
  }

  private _filterProvincias(value: string): ProvinciasModel[] {

    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      return this.ListaProv.filter(f => f.Nombre.toLowerCase().includes(filterValue));
    } else {
      return this.ListaProv;
    }

  }

  private _filterMunicipios(value: string): MunicipiosModel[] {

    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      return this.ListaMun.filter(f => f.Nombre.toLowerCase().includes(filterValue));
    } else {
      return this.ListaMun;
    }

  }

  private _filterAcciones(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ListaAcciones.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterEtiqueta(value: string): Etiqueta[] {

    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      return this.ListaEtiFuente.filter(fruit => fruit.Nombre.toLowerCase().includes(filterValue));
    } else {
      return this.ListaEtiFuente;
    }

  }

  addEti(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let etiquetaNew;
    let anuncioEti;

    // Add our fruit
    if ((value || '').trim() && this.ListaEti.filter(fruit => fruit.Nombre.toLowerCase() === value.trim().toLowerCase()).length === 0
      && this.ListaEtiFuente.filter(fruit => fruit.Nombre.toLowerCase() === value.trim().toLowerCase()).length > 0) {

      const index = this.ListaEtiFuente.findIndex(eti => eti.Nombre.toLowerCase() === value.trim().toLowerCase());
      etiquetaNew = this.ListaEtiFuente.splice(index, 1)[0];
     // anuncioEti = new AnuncioetiquetaModel(0, 0, 0, null, etiquetaNew, true);
      //this.buscarAnuncio.ListaEtiquetas.push(anuncioEti);
      //this.buscarAnuncio.ListaEtiquetas.push(etiquetaNew);
      this.ListaEti.push(etiquetaNew);

    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.inputEtq.setValue(null);
  }

  removeEti(fruit, indx): void {

const etiq = this.ListaEti.splice(indx, 1)[0];

//const index = this.buscarAnuncio.ListaEtiquetas.findIndex(eti => eti.Nombre === etiq.Nombre);
//this.buscarAnuncio.ListaEtiquetas.splice(index, 1);
this.ListaEtiFuente.push(etiq);

  }

  selectedEti(event: MatAutocompleteSelectedEvent): void {

    const value = event.option.value;

    let etiquetaNew;
    let anuncioEti;

    // Add our fruit
    if (this.ListaEti.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length === 0
      && this.ListaEtiFuente.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length > 0) {

      const index = this.ListaEtiFuente.findIndex(eti => eti.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase());
      etiquetaNew = this.ListaEtiFuente.splice(index, 1)[0];
    //  anuncioEti = new AnuncioetiquetaModel(0, 0, 0, null, etiquetaNew, true);
    //  anuncioEti = new Etiqueta(0, etiquetaNew, 0,true, null);
     // this.buscarAnuncio.ListaEtiquetas.push(etiquetaNew);
      this.ListaEti.push(etiquetaNew);
    }

    this.etiquInp.nativeElement.value = '';
    this.inputEtq.setValue(null);
  }

  selectedCategoria(event: MatOptionSelectionChange): void {

    const cate = this.ListaCategoria.filter(fruit => fruit.Nombre === event.source.value)[0];
    this.servCategoria.getEtiquetasByCategoria(cate.CategoriaId).then(res => this.ListaEtiFuente = res as Etiqueta[]);
    this.matAutocomplete2.options.reset([]);
    this._filterEtiqueta('');

  }

  inputProvinciaChange(event): void {
    const listTemp = this.ListaProv.filter(fruit => fruit.Nombre.includes(event));
    if (listTemp.length > 0) {
      this.ListaMun = listTemp[0].Municipios;
      this.buscarAnuncio.Provincia = event;
      if (this.ListaMun.length > 0) {
        this.buscarAnuncio.Municipio = this.ListaMun[0].Nombre;
      //  this.inputMun.setValue(this.buscarAnuncio.Municipio);
      }
    }

  }

  onResize(event) {
    // if (event.target.innerWidth <= 1300 && event.target.innerWidth > 1060) {
    //   this.cantColumnas = 3;
    // } else if (event.target.innerWidth <= 1060 && event.target.innerWidth > 628) {
    //   this.cantColumnas = 2;
    // } else if (event.target.innerWidth <= 628) {
    //   this.cantColumnas = 1;
    // } else {
    //   this.cantColumnas = 4;
    // }
    if(event.target.innerWidth >= 1280)
      this.cantColumnas = 4;
    else if (event.target.innerWidth >= 720 && event.target.innerWidth < 1280)
      this.cantColumnas = 3;
    else if (event.target.innerWidth >= 480 && event.target.innerWidth < 720)
      this.cantColumnas = 2;
    else
      this.cantColumnas = 1;

  }

  clickNuevo() {
    this.ListaAnuncios = null;
    this.filtroReciente = true;
    this.pagActual = 1;
    this.filtroMasVisto = false;
    this.filtroAva = false;
   // this.loadingAnuncio.next(true);
    this.loadingIndicator.showLoading(true);
    this.servAnuncio.getAnunciosCountV2('', this.txtBuscar, 'asc', 1, 5000, 'r')
      .then(res => this.totalPaginas = Math.ceil((res as number) / this.cantPorPagina));
    this.servAnuncio.buscarAnunciosRecientes('', this.txtBuscar, 'asc', 1, this.cantPorPagina).then(res => {
      this.ListaAnuncios = res as AnunciosModel[];

      //this.loadingAnuncio.next(false);
      this.loadingIndicator.showLoading(false);
    });
  }

  buscarTexto() {
   // if (this.txtBuscar !== '') Zuleidy
    {
      this.mostrarResultados = true;
      if (this.filtroReciente) {
        this.clickNuevo();
      } else {
        this.clickPopulares();
      }
    }
  }

  buscarTextoEnter(event) {
   //if (this.txtBuscar !== '' && event.keyCode === 13) {Zuleidy
    if ( event.keyCode === 13) {
      this.mostrarResultados = true;
      if (this.filtroReciente) {
        this.clickNuevo();
      } else {
        this.clickPopulares();
      }
    }
  }

  clickPopulares() {
    //this.loadingAnuncio.next(true);
    this.loadingIndicator.showLoading(true);
    this.ListaAnuncios = null;
    this.pagActual = 1;
    this.filtroReciente = false;
    this.filtroMasVisto = true;
    this.filtroAva = false;
    this.servAnuncio.getAnunciosCountV2('', this.txtBuscar, 'asc', 1, 5000, 'p')
      .then(res => this.totalPaginas = Math.ceil((res as number) / this.cantPorPagina));
    this.servAnuncio.buscarAnunciosPopulares('', this.txtBuscar, 'asc', 1, this.cantPorPagina)
      .then(res => {
        this.ListaAnuncios = res as AnunciosModel[];
       // this.loadingAnuncio.next(false);
        this.loadingIndicator.showLoading(false);
       /* for (const i of (this.ListaAnuncios as AnunciosModel[])) {
          if (i.ImageContent !== undefined && i.ImageContent !== null) {
            i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
          } else {
            i.Imagen = 'data:' + i.Categoria.ImageMimeType + ';base64,' + i.Categoria.ImageContent;
          }
        }*/
      });
  }

  clickCategorias() {
    this.filtroReciente = false;
    this.filtroMasVisto = false;
    this.filtroAva = true;
  }

  clickNext() {

    if(this.pagActual == this.totalPaginas)
      return;
   // this.loadingAnuncio.next(true);
    this.loadingIndicator.showLoading(true);
    this.ListaAnuncios = null;
    if (this.pagActual < this.totalPaginas) {
      this.pagActual = this.pagActual + 1;

      if (this.filtroReciente) {
        this.servAnuncio.buscarAnunciosRecientes('', this.txtBuscar, 'asc', this.pagActual, this.cantPorPagina).then(res => {
          this.ListaAnuncios = res as AnunciosModel[];
        //  this.loadingAnuncio.next(false);
          this.loadingIndicator.showLoading(false);
        });

      } else
      if (this.filtroMasVisto) {
        this.servAnuncio.buscarAnunciosPopulares('', this.txtBuscar, 'asc', this.pagActual, this.cantPorPagina).then(res => {
          this.ListaAnuncios = res as AnunciosModel[];
         // this.loadingAnuncio.next(false);
          this.loadingIndicator.showLoading(false);
          /*for (const i of (this.ListaAnuncios as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
            } else {
              i.Imagen = 'data:' + i.Categoria.ImageMimeType + ';base64,' + i.Categoria.ImageContent;
            }
          }*/

        });
      } else {
        this.buscarAnuncio.indexPage = this.pagActual;
        this.buscarAnuncio.sizePage = this.cantPorPagina;
        this.servAnuncio.buscarAnunciosAvanzados(this.buscarAnuncio).then(res => {
          this.ListaAnuncios = res as AnunciosModel[];

         // this.loadingAnuncio.next(false);
          this.loadingIndicator.showLoading(false);
         /* for (const i of (this.ListaAnuncios as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
            } else {
              i.Imagen = 'data:' + i.Categoria.ImageMimeType + ';base64,' + i.Categoria.ImageContent;
            }
          }*/
        });
      }
    }
  }

  clickAnterior() {
    if(this.pagActual == 1 )
      return;
    //this.loadingAnuncio.next(true);
    this.loadingIndicator.showLoading(true);
    this.ListaAnuncios = null;
    if (this.pagActual > 1) {
      this.pagActual = this.pagActual - 1;
      if (this.filtroReciente) {
        this.servAnuncio.buscarAnunciosRecientes('', this.txtBuscar, 'asc', this.pagActual, this.cantPorPagina)
          .then(res => {
            this.ListaAnuncios = res as AnunciosModel[];
            //this.loadingAnuncio.next(false);
            this.loadingIndicator.showLoading(false);
          });
      } else if (this.filtroMasVisto) {
        this.servAnuncio.buscarAnunciosPopulares('', this.txtBuscar, 'asc', this.pagActual, this.cantPorPagina).then(res => {
          this.ListaAnuncios = res as AnunciosModel[];
         // this.loadingAnuncio.next(false);
          this.loadingIndicator.showLoading(false);
        });
      } else {
        this.buscarAnuncio.indexPage = this.pagActual;
        this.buscarAnuncio.sizePage = this.cantPorPagina;
        this.servAnuncio.buscarAnunciosAvanzados(this.buscarAnuncio).then(res => {
          this.ListaAnuncios = res as AnunciosModel[];
        //  this.loadingAnuncio.next(false);
          this.loadingIndicator.showLoading(false);
        /*  for (const i of (this.ListaAnuncios as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
            } else {
              i.Imagen = 'data:' + i.Categoria.ImageMimeType + ';base64,' + i.Categoria.ImageContent;
            }
          }*/
        });
      }
    }
  }

  prepararFiltros() {
    this.aplicarfiltros = !this.aplicarfiltros;
    //this. clearFilter();Zuleidy no creo q esto este bien
  }

  clearFilter(){
    this.buscarAnuncio.Accion='';
    this.buscarAnuncio.Categoria='';
    this.buscarAnuncio.Descripcion='';
    this.buscarAnuncio.PrecioMin=null;
    this.buscarAnuncio.PrecioMax=null;
    this.buscarAnuncio.Titulo='';
    this.buscarAnuncio.Url='';
    this.buscarAnuncio.NombreContacto='';
    this.buscarAnuncio.TelefonoContacto='';
    this.buscarAnuncio.CorreoContacto='';
    this.buscarAnuncio.IsWeb=false
    this.buscarAnuncio.ProductoNuevo=false;
    this.mostrarMasCamposBusq=false;
    this.etiquInp=null;
    this.buscarAnuncio.HasFoto=false;
    this.inputMun.setValue('');
    this.inputProv.setValue('');
    /*Zuleidy: add*/
    this.buscarAnuncio.Municipio='';
    this.buscarAnuncio.Provincia='';
    this.filtroAva=false;
    /*Zuleidy: add*/
  }
  mostrarMasCampos() {
    this.mostrarMasCamposBusq = !this.mostrarMasCamposBusq;
  }
  @ViewChild('myDiv') myDiv: ElementRef;

  buscarAnunciosFiltros() {

    this.buscarAnuncio.ListaEtiquetas=this.ListaEti;
    this.mostrarResultados = true;
    this.txtBuscar = '';
  //  this.loadingAnuncio.next(true);
    this.loadingIndicator.showLoading(true);
    this.ListaAnuncios = null;
    this.buscarAnuncio.indexPage = 1;
    this.buscarAnuncio.sizePage = this.cantPorPagina;
    this.pagActual = 1;
    this.filtroReciente = false;
    this.filtroMasVisto = false;
    /*Zuleidy: sin esto no funciona el buscar anuncios count */
    this.buscarAnuncio.PrecioMax=0;
    this.buscarAnuncio.PrecioMin=0;
    /***************************************** */

   if((this.buscarAnuncio.Accion!=''&&this.buscarAnuncio.Accion!=undefined)||(this.buscarAnuncio.Categoria!=''&&this.buscarAnuncio.Categoria!=undefined)||(this.buscarAnuncio.Descripcion!=''&&this.buscarAnuncio.Descripcion!=undefined)
      ||(this.buscarAnuncio.Titulo!=''&&this.buscarAnuncio.Titulo!=undefined)||(this.buscarAnuncio.Url!=''&&this.buscarAnuncio.Url!=undefined)||(this.buscarAnuncio.NombreContacto!=''&&this.buscarAnuncio.NombreContacto!=undefined)
      ||(this.buscarAnuncio.TelefonoContacto!=''&&this.buscarAnuncio.TelefonoContacto!=undefined)||(this.buscarAnuncio.CorreoContacto!=''&&this.buscarAnuncio.CorreoContacto!=undefined)
      ||(this.inputMun.value!=''&&this.inputMun.value!=undefined)||(this.inputProv.value!=''&&this.inputProv.value!=undefined)||this.ListaEti.length>0
      ||(this.buscarAnuncio.PrecioMin!=0&&this.buscarAnuncio.PrecioMin!=null) ||(this.buscarAnuncio.PrecioMax!=0&&this.buscarAnuncio.PrecioMax!=null) ||this.buscarAnuncio.HasFoto||this.buscarAnuncio.IsWeb||this.buscarAnuncio.ProductoNuevo
)

    this.filtroAva = true;
  else
    this.filtroAva = false;

    this.aplicarfiltros = false;

    // if(this.buscarAnuncio.Accion != null){
    //   //document.querySelector('.btnSearch').classList.add('btnpp');
    //   document.getElementById("btnSearch").classList.add("btnpp");
    //   console.log('cambio filter '+document.getElementById("btnSearch"))
    //
    // }
    this.servAnuncio.buscarAnunciosAvanzadosCount(this.buscarAnuncio).then(res => {
      this.totalPaginas = Math.ceil((res as number) / this.cantPorPagina);
    });


    this.servAnuncio.buscarAnunciosAvanzados(this.buscarAnuncio).then(res => {
      this.ListaAnuncios = res as AnunciosModel[];
     // this.loadingAnuncio.next(false);
      this.loadingIndicator.showLoading(false);
     /* for (const i of (this.ListaAnuncios as AnunciosModel[])) {
        if (i.ImageContent !== undefined && i.ImageContent !== null) {
          i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
        } else {
          i.Imagen = 'data:' + i.Categoria.ImageMimeType + ';base64,' + i.Categoria.ImageContent;
        }
      }*/

    });



  }



  // Open Modal Insert Anuncio
  openDialog(): void {



  if(this.cantAnunciar==true || (this.currentUser != null && !this.currentUser.Bloqueado))
{
  const dialogRef = this.dialog.open(EditarAnunciosComponent, {
    width: '100%',
    height: 'auto',
    maxWidth: '100% !important',
    panelClass: 'full-screen-modal',
    scrollStrategy: this.overlay.scrollStrategies.close(),
    data: { anuncio: null}
  });
    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');
      // this.animal = result;
    });



}
else
this.toastr.error('Ud no puede anunciar en estos momentos.');

  }

  // Open Modal ReportAnunce
  openDialogReportAnunce(anuncio: AnunciosModel): void {

    if (this.dialog.openDialogs.length == 0) {

      this.loadingIndicator.showLoading(true);
      this.servAnuncio.anuncioVisto(anuncio).then(res => {

        anuncio = res as AnunciosModel;
        //console.log('detalles '+JSON.stringify(anuncio))
        this.servAnuncio.verAnuncio.next(anuncio);
        this.servAnuncio.idAnuncio.next(anuncio.AnuncioId);
        const dialogRef = this.dialog.open(DetailAdvertComponent, {
          width: '900px',
          height: '620px',
          data: {anuncio}
        });

        dialogRef.afterOpened().subscribe(r=>{
          this.loadingIndicator.showLoading(false);
        });

        this.document.body.classList.add('noscroll');

        dialogRef.afterClosed().subscribe(result => {
          this.document.body.classList.remove('noscroll');
          this.servAnuncio.idAnuncio.next(0);
        });
        // if (anuncio.OpcionesAvanzadas.filter(x => x.TipoOpcion.NombreCodigo == 'MI_WEB').length == 0) {
        // const dialogRef = this.dialog.open(DetailAdvertComponent, {
        //   width: '900px',
        //   height: '620px',
        // });
        //
        // this.document.body.classList.add('noscroll');
        //
        // dialogRef.afterClosed().subscribe(result => {
        //   this.document.body.classList.remove('noscroll');
        //   this.servAnuncio.idAnuncio.next(0);
        // });
        // }
        // else
        //   this.router.navigate([]).then(result => { window.open(anuncio.Url, '_blank'); });

      });
    }
  }

  ngAfterViewInit(): void {

   // console.log('cambio filter '+(<HTMLInputElement>document.getElementById("btnSearch")))
  }

ngOnDestroy()
{
  this.finalize.next();
  this.finalize.complete();
}


}
