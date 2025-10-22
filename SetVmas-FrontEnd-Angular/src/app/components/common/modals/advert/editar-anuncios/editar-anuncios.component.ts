// tslint:disable-next-line:max-line-length
import { Component, OnInit, Inject, ViewChild, ElementRef, ComponentFactoryResolver, Type,  ViewContainerRef, ChangeDetectorRef, Input,OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnunciosModel } from '../../../../../models/anuncios.model';
import { DOCUMENT } from '@angular/common';
import { Etiqueta } from '../../../../../models/etiqueta.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AnuncioetiquetaModel } from '../../../../../models/anuncioetiqueta.model';
import { map, startWith } from 'rxjs/operators';
import { FileUploadComponent } from '../../advert/common/fileUpload';
import { ProvinciasModel } from '../../../../../models/provincias.model';
import { ConfiguracionesService } from '../../../../../services/configuration/configuration.service';
import { MunicipiosModel } from '../../../../../models/municipios.model';
import { Categoria } from '../../../../../models/categoria.model';
import { CategoryService } from '../../../../../services/category/category.service';
import { EtiquetaService } from '../../../../../services/tags/etiqueta.service';
import { TipoOpcionModel } from '../../../../../models/tipo-opcion.model';
import { Opciones } from '../../../../../models/opciones.model';
import { AnunciosService } from '../../../../../services/advert/anuncios.service';
import { Banner } from '../../../../../models/banner.model';
import { TipoOpcionService } from '../../../../../services/type-option/tipo-opcion.service';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { Usuario } from '../../../../../models/usuario.model';
import { ToastrService } from 'ngx-toastr';
import { VariableConfiguracionService } from '../../../../../services/variable/variable-configuracion.service';
import { VariableConfiguracion } from '../../../../../models/variable-configuracion.model';
import { Almacenimagen } from '../../../../../models/almacenimagen.model';
import { parse } from 'url';
import { BehaviorSubject, Observable } from 'rxjs';
import { DirectPurchaseComponent } from '../../../../../components/common/modals/office/direct-purchase/direct-purchase.component';
import { Router } from '@angular/router';
import { BuscarAnunciosService } from '../../../../../services/announcement/search-ad.service';
import { UsuarioService } from '../../../../../services/user/usuario.service';
import { ImageValid } from '../../../../../_helpers/ImageValid';
import { isNullOrUndefined } from 'util';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {LoadingIndicatorService} from '../../../../../services/loading/loading-indicator.service';
import { debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import * as EXIF from 'exif-js';
import { CaptchaComponent } from 'angular-captcha';


@Component({
  selector: 'app-editar-anuncios',
  templateUrl: './editar-anuncios.component.html',
  styleUrls: ['./editar-anuncios.component.css']
})
export class EditarAnunciosComponent implements OnInit {

  public myreg = /(^|\s)((^|((http|https):\/\/))[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

  anuncio: AnunciosModel;
  editing:boolean=false;
  fileData: File = null;
  previewUrl: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

  srcOrientation: number =1;
  //Zuleidy Variables
  bannerDesktop: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  imageMimeTypeDesktop: string='';
  imageNameDesktop: string='';

  bannerMobil: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  imageMimeTypeMobil: string = '';
  imageNameMobil: string = '';

  bannerInf: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  imageMimeTypeInf: string = '';
  imageNameInf: string = '';

  listaTipoOpciones: TipoOpcionModel[] = [];
  listaFrecAutoRenovables: TipoOpcionModel[] = [];
  optionsForm: FormGroup;
  submitted = true;
  comprarPutnos = false;
  total: number = 0;
  phoneContact:string;
  emailContact:string;

  bannerDeshabilitado: boolean = false;

  fechaActual: Date;

  diasFinDest: number = 0;
  diasFinDesc: number = 0;
  diasFinAuto: number = 0;
  diasFinImg: number = 0;
  diasFinInf: number = 0;
  diasFinSup: number = 0;
  diasFinWeb: number = 0;

  maxEtiquetas: number = 0;
  maxImgFree: number = 0;
  maxImg: number = 0;
  codigoAuto:string;

  mostrarAlertasEti: number = 0;

  // ***************************Cargando Anuncios***************************************************
  private loadingAnuncio = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingAnuncio.asObservable();

  // ************************************************************************************************

  mostrarBotones = false;

  // Zuleidy Variables


  // ********Chip List*******************
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputEtq = new FormControl();
  inputEtq2 = new FormControl();
  ListaEtiFilter: Observable<Etiqueta[]>;
  ListaEtiFilter2: Observable<Etiqueta[]>;
  ListaEti: Etiqueta[] = [];
  ListaEti2: Etiqueta[] = [];
  ListaEtiFuente: Etiqueta[];
  ListaEtiFuente2: Etiqueta[];


  @ViewChild('etiquInp', { static: false }) etiquInp: ElementRef<HTMLInputElement>;
  @ViewChild('etiquInp2', { static: false }) etiquInp2: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('auto1', { static: false }) matAutocomplete1: MatAutocomplete;
  @ViewChild('auto2', { static: false }) matAutocomplete2: MatAutocomplete;
  @ViewChild('autoProvincia', { static: false }) matAutocomplete3: MatAutocomplete;
  @ViewChild('autoMcpio', { static: false }) matAutocomplete4: MatAutocomplete;

@ViewChild('destacadoDias', { static: true }) destacadoDias: ElementRef;


    @Input() public precioAutorr: number;
  @Input() public precioDesc: number;
  @Input() public precioDest: number;
  @Input() public precioWeb: number;
  @Input() public precioMiWeb: number;
  @Input() public precioImg: number;
  @Input() public precioSup: number;
  @Input() public precioInf: number;

  // ********Chip List*******************

    // *****************AutoCompletar Categorias*******************************************************************
    ListaCategoriaFiltradas: Observable<Categoria[]>;
    ListaCategoria: Categoria[] = [];
    inputCat = new FormControl();
    // ************************************************************************************************************
    // *****************AutoCompletar Accion*******************************************************************
    ListaAccionFiltradas: Observable<string[]>;
    ListaAcciones: string[] = [];
    inputAcc = new FormControl();
    // ************************************************************************************************************
    // *****************AutoCompletar Provincia*******************************************************************
    ListaProvFiltradas: Observable<ProvinciasModel[]>;
    ListaProv: ProvinciasModel[] = [];
    inputProv = new FormControl();
    // ************************************************************************************************************

    // *****************AutoCompletar Municipio*******************************************************************
    ListaMunFiltradas: Observable<MunicipiosModel[]>;
    ListaMun: MunicipiosModel[] = [];
    inputMun = new FormControl();
    // ************************************************************************************************************

  /*directive */
  @ViewChild('containerImg', {read: ViewContainerRef, static: false}) container: ViewContainerRef;
  @ViewChild('containerImgFree', {read: ViewContainerRef, static: false}) containerImgFree: ViewContainerRef;



  // Keep track of list of generated components for removal purposes
  components = [];
  componentsFree = [];
  currentUser: Usuario;

  // Expose class so that it can be used in the template
  fileUploadComponentClass = FileUploadComponent;

  // zuleidy captcha
  captchaComponent: any;
  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;
  captcha = new FormControl('');
   // zuleidy captcha

  constructor(public dialogRef: MatDialogRef<EditarAnunciosComponent>, @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver, private changeDetector: ChangeDetectorRef,
    private servCo: ConfiguracionesService, private servCategoria: CategoryService, public service: AnunciosService,
    private servTO: TipoOpcionService, public authenticationService: AuthenticationService,
    public toastr: ToastrService, private formBuilder: FormBuilder, private serviceVC: VariableConfiguracionService,
    public dialog: MatDialog, private router: Router, private servBA: BuscarAnunciosService,
    private loadingIndicator: LoadingIndicatorService, private servEtiqueta: EtiquetaService,
    private servUser: UsuarioService,@Inject(MAT_DIALOG_DATA) public data: any

  ) {

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    // Zuleidy captcha
    if (this.currentUser === null) {
      this.captcha.setValidators([Validators.required]);
      this.captcha.updateValueAndValidity();
    }
    // Zuleidy captcha



    if (data.anuncio != null) {
      this.anuncio = data.anuncio;
    } else  {
    this.anuncio = new AnunciosModel(0, '', '', '', '',
        '', null, false, false, null, null, '',
        '', '', '', '', '', 0, false, '1',
        '','');
    }


  // ********Chip List2*******************
  this.ListaEtiFilter2 = this.inputEtq2.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filterEtiqueta2(fruit) : this.ListaEtiFuente2));
// ********Chip List2*******************


  }

  ngOnInit() {
    // Yaneisy
    if (this.currentUser!==null){
    this.phoneContact=this.currentUser.Telefono;
    this.emailContact=this.currentUser.Correo;
    this.anuncio.TelefonoContacto=this.phoneContact;
    this.anuncio.CorreoContacto=this.emailContact;
    }else{
      this.anuncio.TelefonoContacto='';
      this.anuncio.CorreoContacto='';
    }


    //Zuleidy
    this.optionsForm = this.formBuilder.group({
      destacadoCheck: [false],
      destacadoDias :[1,[Validators.required]],
      descriptivoCheck: [false],
      descriptivoDias: [1,[Validators.required]],
      autorrenovableCheck: [false],
      autorrenovableDias: [1,[Validators.required]],
      frecuencia: ['Cada 24 horas'],
      webCheck: [false],
      webDias: [1,[Validators.required]],
          web: ['',[Validators.required, Validators.pattern(this.myreg)]],
      miWebCheck: [false],
      imagenCheck: [false],
      imagenDias: [1,[Validators.required]],
      bannerInfCheck: [false],
      bannerInfDias: [1,[Validators.required]],
      bannerSupCheck: [false],
      bannerSupDias: [1,[Validators.required]],
      imageDesk: [null],
      imageMov: [null]
    }
    );

    this.fechaActual = new Date();

    this.document.getElementById('fechaFinDestacado').style.visibility = 'hidden';
    this.document.getElementById('fechaFinDescriptivo').style.visibility = 'hidden';
    this.document.getElementById('fechaFinAuto').style.visibility = 'hidden';
    this.document.getElementById('fechaFinInf').style.visibility = 'hidden';
    this.document.getElementById('fechaFinSup').style.visibility = 'hidden';
    this.document.getElementById('fechaFinWeb').style.visibility = 'hidden';
    this.document.getElementById('fechaFinImg').style.visibility = 'hidden';


    this.document.getElementById('fechaFinDestacadoResp').style.visibility = 'hidden';
    this.document.getElementById('fechaFinDescriptivoResp').style.visibility = 'hidden';
    this.document.getElementById('fechaFinAutoResp').style.visibility = 'hidden';
    this.document.getElementById('fechaFinInfResp').style.visibility = 'hidden';
    this.document.getElementById('fechaFinSupResp').style.visibility = 'hidden';
    this.document.getElementById('fechaFinWebResp').style.visibility = 'hidden';
    this.document.getElementById('fechaFinImgResp').style.visibility = 'hidden';


    //this.document.getElementById('headingThree6').setAttribute('data-toggle', 'collapse') ;
    this.bannerDeshabilitado = true;
    //zuleidy obtener el max de eadtiquetas permitidas para los an anuncios simples
    this.serviceVC.getVariableConfiguracionByCodigo('Max_Etiqueta_Anuncio').then(res => this.maxEtiquetas=Number.parseInt((res as VariableConfiguracion).Valor));
    this.serviceVC.getVariableConfiguracionByCodigo('Max_Img').then(res => this.maxImg=Number.parseInt((res as VariableConfiguracion).Valor));

    //zuleidy si el usuario no es administrador se debe preguntar si la la cantidad de banners actual no excede
    //a la variable de config. Cant-Max-Banners, si es igual ent se deshabilita la opcion de banners superior
      if (this.currentUser != null && (this.currentUser.Rol != null && this.currentUser.Rol != 'Super Administrador') && (this.currentUser.Rol != 'Administrador')) {
        this.service.getBanners('Superior escritorio').then(res => {

      this.serviceVC.getVariableConfiguracionByCodigo('Cant-Max-Banners')
        .then(res2 => {
          if (parseInt((res2 as VariableConfiguracion).Valor) < (res as Banner[]).length) {
            this.document.getElementById('headingThree6').setAttribute('data-toggle', '');
              this.toastr.error('Ud. no puede comprar un banner superior.', 'Banner Superior');
          }

        });
    });

    }

    //Zuleidy actualizar el usuario atenticado
    if(this.currentUser!=null){
      this.authenticationService.getUsuarioById(this.currentUser.UsuarioId).then(res => {
        this.currentUser = res as Usuario;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.authenticationService.currentUserSubject.next(this.currentUser);

      });
    }

    //Zuleidy actualizar el usuario atenticado


    this.ListaAcciones = this.servCo.getAccionesAnuncio();
    this.ListaProv = this.servCo.getProviciasAll();
    this.ListaMun = this.ListaProv[0].Municipios;

  this.servCategoria.getCategoriasAll('Nombre', '', 'asc', 1, 5000)
      .then(res => {
        this.ListaCategoria = res as Categoria[];

        this.ListaCategoriaFiltradas = this.inputCat.valueChanges
            .pipe(
            startWith(''),
            map(value => this._filterCategorias(value))
        );
      });

  this.servEtiqueta.getEtiquetasAll('CantUsada', '', 'desc', 1, 5000)
      .then(res => {
        this.ListaEtiFuente2 = res as Etiqueta[];
      });



    const origen = 'origen';
    const id = 'id';

    // this.rutaAtras = this.actRoute.snapshot.params[origen];
    // this.servAnu.getAnunciosByid(this.actRoute.snapshot.params[id]);
    // this.anuncio = this.servAnu.formData;

    // zuleidy Optener las lista de Opciones
    this.servTO.getTipoOpcionsAll('Nombre', '', 'asc', 1, 5000)
      .then(res => {
        this.listaTipoOpciones = res as TipoOpcionModel[];
        this.precioAutorr = this.listaTipoOpciones.find(x => x.NombreCodigo == 'AUTO_24').Precio;
        this.precioDesc = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ETIQUETAS').Precio;
        this.precioDest = this.listaTipoOpciones.find(x => x.NombreCodigo == 'DESTACADO').Precio;
        if (this.anuncio.OpcionesAvanzadas.filter(x => x.NombreCodigo == 'MI_WEB').length>0) {
          this.precioWeb = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio +
            this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio;
        }
        else
          this.precioWeb = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio;

        this.precioWeb = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio;
        this.precioImg = this.listaTipoOpciones.find(x => x.NombreCodigo == 'IMG_ADI').Precio;
        this.precioSup = this.listaTipoOpciones.find(x => x.NombreCodigo == 'BAN_SUP').Precio;
        this.precioInf = this.listaTipoOpciones.find(x => x.NombreCodigo == 'BAN_INF').Precio;
          this.precioMiWeb = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio +
          this.listaTipoOpciones.find(x => x.NombreCodigo == 'MI_WEB').Precio;

        this.listaFrecAutoRenovables = this.listaTipoOpciones.filter(x => x.NombreCodigo.includes('AUTO_'));
        this.optionsForm.controls.frecuencia.setValue(this.listaFrecAutoRenovables[0].Nombre);
      });




 // this.optionsForm.controls.destacadoDias.disable();
  this.optionsForm.controls.descriptivoDias.disable();
  this.optionsForm.controls.autorrenovableDias.disable();
  this.optionsForm.controls.imagenDias.disable();
  this.optionsForm.controls.bannerInfDias.disable();
  this.optionsForm.controls.bannerSupDias.disable();
  this.optionsForm.controls.webDias.disable();
  this.optionsForm.controls.web.disable();
  document.getElementById('fileUploadImageDesktop').setAttribute('disabled', 'true');
  document.getElementById('fileUploadImageMovil').setAttribute('disabled', 'true');

   // this.service.idAnuncio.subscribe(res => {
 // this.service.verAnuncio.subscribe(res => {
      //if (this.anuncio === null) {
      if (this.anuncio.AnuncioId === 0) {

        this.anuncio.Etiquetas = [];
        this.anuncio.OpcionesAvanzadas = [];
        this.anuncio.Banners = [];
        this.anuncio.AlmacenImagen = [];
        this.anuncio.Categoria=new Categoria(0,'','','','',0);
        this.anuncio.ProductoNuevo = true;
this.anuncio.Precio=0;


      }
      else {


        this.loadingIndicator.showLoading(true);
        this.service.getAnunciosByidV2(this.anuncio.AnuncioId).then((res) => {//Zuleidy ojo probar
      //  this.service.verAnuncio.subscribe(res => {

            this.anuncio = res as AnunciosModel;

          this.editing=true;
         /* this.previewUrl = this.anuncio.ImageName;
          if (this.anuncio.Imagen!=null) {
            this.readImage(this.anuncio.Imagen, 200, 350, 'fileUploadImageSimple');
          }
*/

         this.ListaEtiFuente=this.anuncio.Categoria.Etiquetas;

          this.updateEtiquetas();

          //****************Cargar etiquetas de la vista simple de anuncios**********************
         /* for (var i = 0; i < this.anuncio.Etiquetas.filter(x=>x.IsFree==true).length; i++) {
              this.ListaEti.push(this.anuncio.Etiquetas.filter(x=>x.IsFree==true)[i]);
            }*/
          //****************Cargar etiquetas de la vista simple de anuncios**********************

          this.ListaEti=this.anuncio.Etiquetas.filter(x=>x.IsFree==true);

          //Zuleidy Cargar la lista de municipios de la provincia del anuncio
          if(this.anuncio.Provincia.trim().length !== 0)
            this.ListaMun = this.ListaProv.filter(x=>x.Nombre==this.anuncio.Provincia)[0].Municipios;
          else
            this.ListaMun = this.ListaProv[0].Municipios;


          this.mostrarBotones = true;

          this.servTO.getTipoOpcionsAll('Nombre', '', 'asc', 1, 5000)
            .then(op => {

          //Zuleidy Opciones avanazadas del anuncio
          this.total = 0;
                var opcion;
          for (var i = 0; i < this.anuncio.OpcionesAvanzadas.length; i++) {
            switch (this.anuncio.OpcionesAvanzadas[i].NombreCodigo) {
              case 'DESTACADO':
                this.optionsForm.controls.destacadoCheck.setValue(true);
                this.optionsForm.controls.destacadoDias.setValue(0);
                this.diasFinDest = this.getDiasDesac(this.anuncio.OpcionesAvanzadas[i].FechaDesactivacion);
                this.document.getElementById('fechaFinDestacado').style.visibility = 'visible';
                this.document.getElementById('fechaFinDestacadoResp').style.visibility = 'visible';
               break;
              case 'ETIQUETAS':
                this.optionsForm.controls.descriptivoCheck.setValue(true);
                this.optionsForm.controls.descriptivoDias.setValue(0);
                this.diasFinDesc = this.getDiasDesac(this.anuncio.OpcionesAvanzadas[i].FechaDesactivacion);
                this.document.getElementById('fechaFinDescriptivo').style.visibility = 'visible';
                this.document.getElementById('fechaFinDescriptivoResp').style.visibility = 'visible';
                //****************Cargar etiquetas de la vista avanzada de anuncios**********************
               /* for (var i = 0; i < this.anuncio.Etiquetas.filter(x=>x.IsFree==false).length; i++) {
                    this.ListaEti2.push(this.anuncio.Etiquetas.filter(x=>x.IsFree==false)[i]);
                }*/
                this.ListaEti2=this.anuncio.Etiquetas.filter(x=>x.IsFree==false);
                //****************Cargar etiquetas de la vista avanzada de anuncios**********************
                break;
              case 'AUTO_24': case 'AUTO_6': case 'AUTO_1':case 'AUTO_TOP':case 'AUTO_3': case 'AUTO_30':
                this.optionsForm.controls.autorrenovableCheck.setValue(true);
                this.optionsForm.controls.autorrenovableDias.setValue(0);
                this.diasFinAuto = this.getDiasDesac(this.anuncio.OpcionesAvanzadas[i].FechaDesactivacion);
                this.document.getElementById('fechaFinAuto').style.visibility = 'visible';
               this.document.getElementById('fechaFinAutoResp').style.visibility = 'visible';
                opcion=(op as TipoOpcionModel[]).find(x => x.NombreCodigo == this.anuncio.OpcionesAvanzadas[i].NombreCodigo);
                this.optionsForm.controls.frecuencia.setValue(opcion.Nombre);
                this.precioAutorr = opcion.Precio;
                this.codigoAuto=opcion.NombreCodigo;
                break;
              case 'ENLACE_WEB':
                this.optionsForm.controls.webCheck.setValue(true);
                this.optionsForm.controls.webDias.setValue(0);
                this.optionsForm.controls.web.setValue(this.anuncio.Url);
                this.diasFinWeb = this.getDiasDesac(this.anuncio.OpcionesAvanzadas[i].FechaDesactivacion);
                this.document.getElementById('fechaFinWeb').style.visibility = 'visible';
                this.document.getElementById('fechaFinWebResp').style.visibility = 'visible';
                break;
              case 'MI_WEB':
                this.optionsForm.controls.miWebCheck.setValue(true);
                this.precioWeb=this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio +
                this.listaTipoOpciones.find(x => x.NombreCodigo == 'MI_WEB').Precio;
                break;
              case 'IMG_ADI':
                this.optionsForm.controls.imagenCheck.setValue(true);
                this.optionsForm.controls.imagenDias.setValue(0);
                this.diasFinImg = this.getDiasDesac(this.anuncio.OpcionesAvanzadas[i].FechaDesactivacion);
                this.document.getElementById('fechaFinImg').style.visibility = 'visible';
                this.document.getElementById('fechaFinImgResp').style.visibility = 'visible';
                break;
              case 'BAN_INF':
                this.optionsForm.controls.bannerInfCheck.setValue(true);
                this.optionsForm.controls.bannerInfDias.setValue(0);
                this.diasFinInf = this.getDiasDesac(this.anuncio.OpcionesAvanzadas[i].FechaDesactivacion);
                this.document.getElementById('fechaFinInf').style.visibility = 'visible';
                this.document.getElementById('fechaFinInfResp').style.visibility = 'visible';
                this.imageNameInf =  this.anuncio.Banners.find(x => x.Tipo == 'Inferior').ImageName;
                this.imageMimeTypeInf = this.anuncio.Banners.find(x => x.Tipo == 'Inferior').ImageMimeType;

                break;
              case 'BAN_SUP':
                this.optionsForm.controls.bannerSupCheck.setValue(true);
                this.optionsForm.controls.bannerSupDias.setValue(0);
                this.diasFinSup = this.getDiasDesac(this.anuncio.OpcionesAvanzadas[i].FechaDesactivacion);
                this.document.getElementById('fechaFinSup').style.visibility = 'visible';
                this.document.getElementById('fechaFinSupResp').style.visibility = 'visible';
           this.bannerDesktop =this.getUrlImage(this.anuncio.Banners.find(x => x.Tipo == 'Superior escritorio').ImageName,'banners') ;
                this.imageNameDesktop = this.anuncio.Banners.find(x => x.Tipo == 'Superior escritorio').ImageName;
                this.imageMimeTypeDesktop = this.anuncio.Banners.find(x => x.Tipo == 'Superior escritorio').ImageMimeType;

                this.bannerMobil =this.getUrlImage(this.anuncio.Banners.find(x => x.Tipo == 'Superior movil').ImageName,'banners') ;
                this.imageNameMobil = this.anuncio.Banners.find(x => x.Tipo == 'Superior movil').ImageName;
                this.imageMimeTypeMobil = this.anuncio.Banners.find(x => x.Tipo == 'Superior movil').ImageMimeType;

                document.getElementById('fileUploadImageDesktop').setAttribute('disabled', 'true');
                document.getElementById('fileUploadImageMovil').setAttribute('disabled', 'true');


                break;
              default:
            }
              }

            });
          //Zuleidy Opciones avanazadas del anuncio

          if(this.anuncio.Etiquetas == null)
            this.anuncio.Etiquetas = [];

          this.loadingIndicator.showLoading(false);
         });

      }
   // });


if(this.currentUser!=null){
    this.anuncio.Usuario = this.currentUser;
this.anuncio.TelefonoContacto=this.currentUser.Telefono;
this.anuncio.CorreoContacto=this.currentUser.Correo;
  } else
{
  this.servUser.getUsuarioByCorreo('invitado@gmail.com').then(res => {
    this.anuncio.Usuario = res as Usuario;
  });
}




    this.ListaProvFiltradas = this.inputProv.valueChanges
    .pipe(
      startWith(''),
      map((value ) => this._filterProvincias(value))
    );

    this.ListaMunFiltradas = this.inputMun.valueChanges
    .pipe(
      startWith(''),
      map((value ) => this._filterMunicipios(value))
    );


    this.ListaAccionFiltradas = this.inputAcc.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterAcciones(value))
    );


  }
  get f() {
    return this.optionsForm.controls;
  }


  //Zuleidy recapctcha
  addRecaptchaScript() {
    window['grecaptchaCallback'] = () => {
      this.renderReCaptcha();
    };

    (function (d, s, id, obj) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = 'https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));

  }

  renderReCaptcha() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
     //'sitekey': '6LePbq4UAAAAAPqwJU8u5g1Of1TIEMyoPpJQpyaD',
     //'sitekey': '6LePbq4UAAAAAPqwJU8u5g1Of1TIEMyoPpJQpyaD',
      'sitekey': '6LfI1fcUAAAAAEwQ1Fb86Qkhabye30Y81fMYxsHM',
      'callback': (response) => {
  this.captcha.setValue(response);
      }
    });
  }
  resolved(captchaResponse: string) {
      this.captcha.setValue(captchaResponse);
    }
  //Zuleidy recapctcha

  updateCurrentUser() {
    if (this.currentUser!=null) {
      // JSON.parse(JSON.stringify(this.currentUser)).Clase;
      // var clase = this.currentUser.ClasesUsuarios.ClasesUsuariosId;

      var clase = this.currentUser.Clase;
      //Zuleidy actualizar el usuario atenticado
      this.authenticationService.getUsuarioById(this.currentUser.UsuarioId).then(res => {
        this.currentUser = res as Usuario;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.authenticationService.currentUserSubject.next(this.currentUser);
        if (clase != this.currentUser.Clase)
          this.toastr.success('Felicidades. Usted ha subido al nivel ' + this.currentUser.Clase);
      });
    //Zuleidy actualizar el usuario atenticado
    }

  }


  //Zuleidy metodo para calcular los dias de deactivacion
  getDiasDesac(fecha: Date): number {

    var diff = Math.abs(new Date(fecha).getTime() - new Date(this.fechaActual).getTime());
     return Math.ceil(diff / (1000 * 3600 * 24));
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
   // console.log('datos anuncio editar '+JSON.stringify(this.anuncio))
  /*load componente FileUpload */
    this.serviceVC.getVariableConfiguracionByCodigo('Max_Img_Free').then(res => {
      this.maxImgFree = Number.parseInt((res as VariableConfiguracion).Valor);

      //if (this.anuncio.AlmacenImagen!=null) {
      if (this.anuncio.AlmacenImagen!=null && this.anuncio.AlmacenImagen.length > 0) {
        var length = 0;
        this.anuncio.AlmacenImagen.length > this.maxImgFree ? length = this.maxImgFree : length = this.anuncio.AlmacenImagen.length;
        for (var i = 0; i < length; i++)
          this.addComponentImgFree(this.fileUploadComponentClass,this.getUrlImage(this.anuncio.AlmacenImagen[i].ImageName,'almacen'), this.anuncio.AlmacenImagen[i].ImageName);
    }//}
      else
        this.addComponentImgFree(this.fileUploadComponentClass, '', '');


        if (this.anuncio.AlmacenImagen!=null && this.anuncio.AlmacenImagen.length > this.maxImgFree) {
          for (var i = this.maxImgFree; i < this.anuncio.AlmacenImagen.length; i++)
            this.addComponent(this.fileUploadComponentClass, this.getUrlImage(this.anuncio.AlmacenImagen[i].ImageName,'almacen'), this.anuncio.AlmacenImagen[i].ImageName, true);
        }
      else
        this.addComponent(this.fileUploadComponentClass, '', '',true);



  });
    this.changeDetector.detectChanges();



 /* fromEvent(this.destacadoDias.nativeElement, 'change')
      .pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {


      })
  )
      .subscribe();*/

}

  //ignore first time change
  ignoredFirstEvent = false;

  inputProvinciaChange(event): void {

    if(this.ignoredFirstEvent){
      const listTemp = this.ListaProv.filter(fruit => fruit.Nombre.includes(event));
      if (listTemp.length > 0) {
        this.ListaMun = listTemp[0].Municipios;
        this.anuncio.Provincia = event;
        if (this.ListaMun.length > 0) {
          this.anuncio.Municipio = this.ListaMun[0].Nombre;
          this.inputMun.setValue(this.anuncio.Municipio);
        }
      }
    }
    else
      this.ignoredFirstEvent = true;

  }

  private _filterCategorias(value: string): Categoria[] {

    if (value !== null && value !== undefined && value.length !== undefined && value !== '') {
      const filterValue = value.toLowerCase();

      return this.ListaCategoria.filter(option => option.Nombre.toLowerCase().includes(filterValue));
    } else {

      return this.ListaCategoria;
    }

  }

  private _filterAcciones(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ListaAcciones.filter(option => option.toLowerCase().includes(filterValue));
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

  private _filterEtiqueta(value: string): Etiqueta[] {

    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      let res = this.ListaEtiFuente.filter(fruit => fruit.Nombre.toLowerCase().includes(filterValue));
      if(res.length === 0){
        if(this.mostrarAlertasEti === 0){
          this.toastr.error('Etiqueta Inválida', 'Anuncio');
          this.mostrarAlertasEti=1;
          setTimeout(() => {
            this.mostrarAlertasEti = 0;


          }, 5000);
        }

      }

      return res;
    } else {
      return this.ListaEtiFuente;
    }
  }

private _filterEtiqueta2(value: string): Etiqueta[] {

  var filterValue='';
  if (value !== null && value !== undefined && value.length !== undefined) {
    filterValue= value.toLowerCase();

    this.servEtiqueta.getEtiquetasAll('CantUsada', filterValue, 'desc', 1, 20)
        .then(res => {
          this.ListaEtiFuente2 = res as Etiqueta[];
        });

  }


  return this.ListaEtiFuente2;
}

  selectedCategoria(cat): void {


  this.loadingIndicator.showLoading(true);
  this.anuncio.Categoria=cat;
 // this.ListaEtiFuente=this.anuncio.Categoria.Etiquetas;
 this.servCategoria.getEtiquetasByCategoria(cat.CategoriaId).then(res =>{

   this.ListaEtiFuente = res as Etiqueta[];
   //**********Borrar todas las etieuetasd de los anuncios**********
   if(this.ListaEti.length>0)
   {
     this.ListaEti.forEach(item => {
       const index = this.anuncio.Etiquetas.findIndex(eti => eti.Nombre === item.Nombre);
       this.anuncio.Etiquetas.splice(index, 1);
     });
     this.ListaEti.splice(0, this.ListaEti.length);
   }
//**********Borrar todas las etieuetasd de los anuncios**********

   this.matAutocomplete2.options.reset([]);
   this._filterEtiqueta('');
   this.updateEtiquetas();

   this.loadingIndicator.showLoading(false);
 });
  }

updateEtiquetas(){

  // ********Chip List*******************
  this.ListaEtiFilter = this.inputEtq.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filterEtiqueta(fruit) : this.ListaEtiFuente));
// ********Chip List*******************


}

selectedProvincia(option): void {

  var val= option.Nombre;
this.ListaMun=[];
this._filterMunicipios('');
this.inputMun.setValue('');

if(val!=undefined)
  this.ListaMun = this.ListaProv.filter(fruit => fruit.Nombre === val)[0].Municipios;
this.anuncio.Municipio=this.ListaMun[0].Nombre;
//this.matAutocomplete4.options.reset([] );

}


  addComponent(componentClass: Type<any>, url: string, name: string, disabled: boolean) {
    // Create component dynamically inside the ng-template

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);

    component.instance.idAttrFileUpload = 'fileUpload_' + (this.components.length + this.maxImgFree);
    component.instance.idImg = 'imgUpload_' + (this.components.length + this.maxImgFree);

    component.instance.disableComponent = disabled;


    if (url !== '') {
      component.instance.urlImg = url;
      component.instance.name = name;
      component.instance.disableComponent = disabled;
      component.instance.editing = true;
    }

    component.instance.addEvent.subscribe(event => {
    if ((this.components.length < this.maxImg) ) { // mas uno porq es el componente vacio q se se crea en las imagenes adicionales
     // if (this.components[0].instance.disableComponent == false)
        this.addComponent(this.fileUploadComponentClass, '', '', disabled);
    } else {
      this.toastr.error('Ud. ha excedido el número máximo de imágenes.', 'Anuncio');
    }

    });

    component.instance.errorSizeEvent.subscribe(event => {
      this.toastr.error('El tamaño supera el límite permitido (4MB).', 'Anuncio');
    });

    // Push the component so that we can keep track of which components are created
    this.components.push(component);

    component.instance.deleteEvent.subscribe(event => {
      const componentToDelete = this.components.find((comp) =>
        comp.instance instanceof componentClass && comp.instance.idAttrFileUpload === component.instance.idAttrFileUpload);
      const componentIndex = this.components.indexOf(componentToDelete);

      if (this.components.length === 1) {
        componentToDelete.instance.urlImg = '';
        componentToDelete.instance.name = '';
        componentToDelete.instance.disableComponent = false;
      } else
      if (componentIndex !== -1) {
        this.container.remove(componentIndex);
        this.components.splice(componentIndex, 1);
      }
      if (this.components.length === 0) {
        this.addComponent(this.fileUploadComponentClass, '', '', false);
      }


      });

   }

  addComponentImgFree(componentClass: Type<any>, url: string, name: string) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.containerImgFree.createComponent(componentFactory);

    component.instance.idAttrFileUpload = 'fileUpload_' + (this.componentsFree.length) + name;
    component.instance.idImg = 'imgUpload_' + (this.componentsFree.length) + name;

    if (url !== '') {
      component.instance.urlImg = url;
      component.instance.name = name;
      component.instance.disableComponent = false;
      component.instance.editing = true;
    }
    component.instance.addEvent.subscribe(event => {
      if (this.componentsFree.length < this.maxImgFree) { // mas uno porq es el componente vacio q se se crea en las imagenes adicionales
        this.addComponentImgFree(this.fileUploadComponentClass, '', '');
      } else {
        this.toastr.error('Si desea insertar más imágenes debe acceder a la opción Configuración Avanzada.', 'Anuncio');
      }

    });
    component.instance.errorSizeEvent.subscribe(event => {
    this.toastr.error('El tamaño supera el límite permitido (4MB).', 'Anuncio');
  });


    // Push the component so that we can keep track of which components are created
    this.componentsFree.push(component);

    component.instance.deleteEvent.subscribe(event => {
    const componentToDelete = this.componentsFree.find((comp) =>
      comp.instance instanceof componentClass && comp.instance.idAttrFileUpload === component.instance.idAttrFileUpload);
    const componentIndex = this.componentsFree.indexOf(componentToDelete);


    if (this.componentsFree.length === 1) {
      componentToDelete.instance.urlImg = '';
      componentToDelete.instance.name = '';
      componentToDelete.instance.disableComponent = false;
      this.toastr.error('Eliminar1' + componentToDelete.instance.idAttrFileUpload);
    } else
      if (componentIndex !== -1) {
        this.containerImgFree.remove(componentIndex);
        this.componentsFree.splice(componentIndex, 1);
      }
    if (this.componentsFree.length === 0) {
      this.addComponentImgFree(this.fileUploadComponentClass, '', '');
    }

  });


   }

  removeComponent(componentClass: Type<any>) {
    // Find the component
    // tslint:disable-next-line:no-shadowed-variable
    const component = this.components.find((component) => component.instance instanceof componentClass);
    const componentIndex = this.components.indexOf(component);

    if (componentIndex !== -1) {
      // Remove component from both view and array
      this.container.remove(this.container.indexOf(component));
      this.components.splice(componentIndex, 1);
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  //Zuleidy evento de cambiar la frecuencia
  changeFrecuencia(value: TipoOpcionModel) {

  //delete opcion
  this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo== this.codigoAuto), 1);
  this.diasFinAuto=0;
  //delete opcion

    this.optionsForm.controls.frecuencia.setValue(value.Nombre);
    this.precioAutorr = value.Precio;
    this.codigoAuto=this.getCodigoByFrec();
  //crear un opcion avamnzada con la nueva frecuencia
  this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'', this.codigoAuto,this.optionsForm.controls.autorrenovableDias.value,0,0,0, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == this.getCodigoByFrec()).TipoOpcionId));

  //switch (value) {
    //  case 'Cada 24 horas':
    //    this.precioAutorr = this.listaTipoOpciones.find(x => x.NombreCodigo == 'AUTO_24').Precio;
    //    break;
    //  case 'Cada 6 horas':
    //    this.precioAutorr = this.listaTipoOpciones.find(x => x.NombreCodigo == 'AUTO_6').Precio;
    //    break;
    //  case 'Cada 1 hora':
    //    this.precioAutorr = this.listaTipoOpciones.find(x => x.NombreCodigo == 'AUTO_1').Precio;
    //    break;
    //  case 'Top':
    //    this.precioAutorr = this.listaTipoOpciones.find(x => x.NombreCodigo == 'AUTO_TOP').Precio;
    //    break;
    //  default:
    //}
    this.calcular('');
  }
  checkValidations(values:MatCheckboxChange) {
  //this.total=0;

    switch (values.source.value) {
      case 'destacado':
        if (values.checked == true) {
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','DESTACADO',0,0,0, 0, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == 'DESTACADO').TipoOpcionId));
          this.optionsForm.controls.destacadoDias.enable();
          this.optionsForm.controls.destacadoDias.setValidators([Validators.required, Validators.minLength(1)]);
        }
        else {

          this.optionsForm.controls.destacadoDias.setValue(0);
          this.document.getElementById('fechaFinDestacado').style.visibility = 'hidden';
          this.document.getElementById('fechaFinDestacadoResp').style.visibility = 'hidden';
            this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='DESTACADO'), 1);
            this.diasFinDest = 0;
          this.optionsForm.controls.destacadoDias.setValidators(null);

        }
        this.optionsForm.controls.destacadoDias.updateValueAndValidity();
        break;
      case 'descriptivo':
        if (values.checked == true) // && (this.anuncio.Etiquetas.length == this.maxEtiquetas))
         {
       // this.inputEtq2.setValidators([Validators.required]);
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','ETIQUETAS',0,0,0,0, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == 'ETIQUETAS').TipoOpcionId));
         // this.inputEtq2.updateValueAndValidity();
          this.optionsForm.controls.descriptivoDias.enable();
           this.optionsForm.controls.descriptivoDias.setValidators([Validators.required, Validators.minLength(1)]);
        }
        else {
          this.optionsForm.controls.descriptivoDias.setValue(0);
       //   this.inputEtq2.setValidators(null);
          this.document.getElementById('fechaFinDescriptivo').style.visibility = 'hidden';
          this.document.getElementById('fechaFinDescriptivoResp').style.visibility = 'visible';
         ///**********Borrar todas las etieuetas de los anuncios**********
            if(this.ListaEti2.length>0)
            {
              this.ListaEti2.forEach(item => {
                const index = this.anuncio.Etiquetas.findIndex(eti => eti.Nombre === item.Nombre);
                this.anuncio.Etiquetas.splice(index, 1);
              });
              this.ListaEti2.splice(0, this.ListaEti2.length);
            }
//**********Borrar todas las etieuetas de los anuncios**********

          //delete opcion
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='ETIQUETAS'), 1);
          this.diasFinDesc=0;
          //delete opcion
          this.optionsForm.controls.descriptivoDias.setValidators(null);
        }
        this.optionsForm.controls.descriptivoDias.updateValueAndValidity();
        break;
      case 'auto':
        if (values.checked == true) {
          this.optionsForm.controls.frecuencia.setValue('Autorrenovable 24 horas');
          this.optionsForm.controls.autorrenovableDias.enable();
          this.codigoAuto='Auto24';
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'',this.codigoAuto,0,0,0,0, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == this.getCodigoByFrec()).TipoOpcionId));
          this.optionsForm.controls.autorrenovableDias.setValidators([Validators.required, Validators.minLength(1)]);

        }
        else {
          this.optionsForm.controls.autorrenovableDias.setValue(0);
          this.document.getElementById('fechaFinAuto').style.visibility = 'hidden';
          this.document.getElementById('fechaFinAutoResp').style.visibility = 'hidden';
          //delete opcion
           this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo==this.codigoAuto), 1);
          this.diasFinAuto=0;
          //delete opcion
          this.optionsForm.controls.autorrenovableDias.setValidators(null);

        }
        this.optionsForm.controls.autorrenovableDias.updateValueAndValidity();
        break;
    case 'imagenes':
      if (values.checked == true && this.componentsFree.length == this.maxImgFree) {
          this.container.clear();
        this.optionsForm.controls.imagenDias.enable();
          this.components.splice(0, this.components.length);
          this.addComponent(this.fileUploadComponentClass, '', '', false);
        this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','IMG_ADI',0,0,0,  0, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == 'IMG_ADI').TipoOpcionId));
        this.optionsForm.controls.imagenDias.setValidators([Validators.required, Validators.minLength(1)]);

        break;
        }
      else if (values.checked == true && this.componentsFree.length < this.maxImgFree){
        this.toastr.error('Debe insertar el máximo de imágenes permitidas en la vista simple.', 'Anuncio');
        this.optionsForm.controls.imagenCheck.setValue(false);
       }
        this.optionsForm.controls.imagenDias.setValue(0);
        this.document.getElementById('fechaFinImg').style.visibility = 'hidden';
        this.document.getElementById('fechaFinImgResp').style.visibility = 'hidden';
        this.container.clear();
        this.components.splice(0, this.components.length);
        this.addComponent(this.fileUploadComponentClass, '', '', true);
      //delete opcion
      this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='IMG_ADI'), 1);
      this.diasFinImg=0;
      this.optionsForm.controls.imagenDias.setValidators(null);
      //delete opcion\
      this.optionsForm.controls.imagenDias.updateValueAndValidity();
        break;
      case 'inferior':
        if ((values.checked == true)&& this.anuncio.ImageName !== undefined && this.anuncio.ImageName !== null && this.anuncio.ImageName !== '') {;
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','BAN_INF',0,0,0,  0, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == 'BAN_INF').TipoOpcionId));
          this.anuncio.Banners.push(new Banner(0, null, null, 'Inferior', 0, '',this.anuncio.ImageMimeType,this.anuncio.ImageName, new Date(), new Date(), new Date(), true, this.anuncio.AnuncioId));
          this.optionsForm.controls.bannerInfDias.enable();
          this.optionsForm.controls.bannerInfDias.setValidators([Validators.required, Validators.minLength(1)]);
          break;
        }
        else if ((values.checked == true) &&  (this.anuncio.ImageName == undefined || this.anuncio.ImageName !== null || this.anuncio.ImageName !== '')) {
         this.toastr.error('Debe insertar una imagen principal al anuncio.', 'Anuncio');
          this.optionsForm.controls.bannerInfCheck.setValue(false);

        }
       this.optionsForm.controls.bannerInfDias.setValue(0);
       this.optionsForm.controls.bannerInfDias.setValidators(null);
        this.document.getElementById('fechaFinInf').style.visibility = 'hidden';
        this.document.getElementById('fechaFinInfResp').style.visibility = 'hidden';
        this.optionsForm.controls.bannerInfDias.updateValueAndValidity();
        //delete opcion
        this.anuncio.Banners.splice(this.anuncio.Banners.findIndex(x=>x.Tipo=='Inferior'), 1);
        this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='BAN_INF'), 1);
        this.diasFinInf=0;
        //delete opcion
        break;
      case 'superior':
        if (values.checked == true) {

          this.optionsForm.controls.imageDesk.setValidators([Validators.required, ImageValid('fileUploadImageDesktop')]);
          this.optionsForm.controls.imageMov.setValidators([Validators.required, ImageValid('fileUploadImageMovil')]);
          document.getElementById('fileUploadImageDesktop').removeAttribute('disabled');
          document.getElementById('fileUploadImageMovil').removeAttribute('disabled');
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','BAN_SUP',0,0,0,  this.optionsForm.controls.bannerSupDias.value, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == 'BAN_SUP').TipoOpcionId));
          this.anuncio.Banners.push(new Banner(0, '', '', 'Superior escritorio', 0, this.bannerDesktop, this.imageMimeTypeDesktop, this.imageNameDesktop, new Date(), new Date(), new Date(), true, this.anuncio.AnuncioId));
          this.anuncio.Banners.push(new Banner(0, '', '', 'Superior movil', 0, this.bannerMobil, this.imageMimeTypeMobil, this.imageNameMobil, new Date(), new Date(), new Date(),true, this.anuncio.AnuncioId));

          this.optionsForm.controls.bannerSupDias.enable();
          this.optionsForm.controls.bannerSupDias.setValidators([Validators.required, Validators.minLength(1)]);
        }
        else {

          this.optionsForm.controls.bannerSupDias.setValue(0);
          this.optionsForm.controls.imageDesk.setValidators(null);
          this.optionsForm.controls.imageMov.setValidators(null);
          this.document.getElementById('fechaFinSup').style.visibility = 'hidden';
          this.document.getElementById('fechaFinSupResp').style.visibility = 'hidden';
          document.getElementById('fileUploadImageDesktop').setAttribute('disabled', 'true');
          document.getElementById('fileUploadImageMovil').setAttribute('disabled', 'true');

          document.getElementById('fileUploadImageDesktop1').setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=');
          document.getElementById('fileUploadImageMovil1').setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=');
          //delete opcion
          this.anuncio.Banners.splice(this.anuncio.Banners.findIndex(x=>x.Tipo=='Superior escritorio'), 1);
          this.anuncio.Banners.splice(this.anuncio.Banners.findIndex(x=>x.Tipo=='Superior movil'), 1);
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='BAN_SUP'), 1);
          this.diasFinSup=0;
          //delete opcion
          this.optionsForm.controls.bannerSupDias.setValidators(null);

        }
      this.optionsForm.controls.imageDesk.updateValueAndValidity();
      this.optionsForm.controls.imageMov.updateValueAndValidity();
      this.optionsForm.patchValue({
        imageMov: null,
        imageDesk:null
      });
        this.optionsForm.controls.bannerSupDias.updateValueAndValidity();
        break;
      case 'web':
        if (values.checked == true) {
          //this.optionsForm.controls.web.setValidators([Validators.required, Validators.pattern(this.myreg)]);

          this.optionsForm.controls.web.enable();
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','ENLACE_WEB',0,0,0,  0, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').TipoOpcionId));
         // this.optionsForm.controls.web.updateValueAndValidity();
          this.optionsForm.controls.webDias.setValidators([Validators.required, Validators.minLength(1)]);

        }
        else {

          this.optionsForm.controls.webDias.setValue(0);
          this.optionsForm.controls.web.setValue('http://setvmas.com');
       //   this.optionsForm.controls.web.setValidators(null);
          this.optionsForm.controls.miWebCheck.setValue(false);
        //  this.optionsForm.controls.webDias.setValidators(null);
        //  this.optionsForm.controls.web.setValidators(null);
          this.document.getElementById('fechaFinWeb').style.visibility = 'hidden';
          this.document.getElementById('fechaFinWebResp').style.visibility = 'hidden';
          this.precioWeb =this.listaTipoOpciones.find(x => x.NombreCodigo === 'ENLACE_WEB').Precio;
          //delete opcion
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='ENLACE_WEB'), 1);
          if(this.anuncio.OpcionesAvanzadas.filter(x => x.NombreCodigo === 'MI_WEB').length>0)
            this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='MI_WEB'), 1);
          this.diasFinWeb=0;
          //delete opcion
          this.optionsForm.controls.webDias.setValidators(null);
        }
      //  this.optionsForm.controls.web.updateValueAndValidity();
        this.optionsForm.controls.webDias.updateValueAndValidity();
      break;
    case 'miWebCheck':
      //miWebCheck
      if (values.checked == true) {
          this.precioWeb = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio +
          this.listaTipoOpciones.find(x => x.NombreCodigo == 'MI_WEB').Precio;
        this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','MI_WEB',this.diasFinWeb,0,0,  0, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == 'MI_WEB').TipoOpcionId));
      }
      else
      {
        this.precioWeb = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio;
        //delete opcion
        this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='MI_WEB'), 1);

        //delete opcion
      }
      break;
    }

    this.calcular('');
  }

   calcular(name) {
this.total = 0;

switch (name) {
  case 'destacadoDias':
    this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='DESTACADO')[0].CantidadDias = this.optionsForm.controls.destacadoDias.value + this.diasFinDest;
    break;
  case 'descriptivoDias':
    this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='ETIQUETAS')[0].CantidadDias = this.optionsForm.controls.descriptivoDias.value+this.diasFinDesc;
  // this.total =this.optionsForm.controls.descriptivoDias.value ;
    break;
  case 'autorrenovableDias':

    this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo==this.codigoAuto)[0].CantidadDias = this.optionsForm.controls.autorrenovableDias.value+this.diasFinAuto;
    break;
  case 'webDias':

    this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='ENLACE_WEB')[0].CantidadDias = this.optionsForm.controls.webDias.value+this.diasFinWeb;
    if(this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='MI_WEB').length > 0)
    {
      this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='MI_WEB')[0].CantidadDias = this.optionsForm.controls.webDias.value+this.diasFinWeb;

    }

    break;
  case 'imagenDias':
    this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='IMG_ADI')[0].CantidadDias=this.optionsForm.controls.imagenDias.value+this.diasFinImg;
    break;
  case 'bannerInfDias':
    this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='BAN_INF')[0].CantidadDias=this.optionsForm.controls.bannerInfDias.value+this.diasFinInf;
    this.anuncio.Banners.filter(x=>x.Tipo=='Inferior')[0].CantidadDias=this.optionsForm.controls.bannerInfDias.value+this.diasFinInf;
    break;
  case 'bannerSupDias':
    this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='BAN_SUP')[0].CantidadDias=this.optionsForm.controls.bannerSupDias.value+this.diasFinSup;
    this.anuncio.Banners.filter(x=>x.Tipo=='Superior escritorio')[0].CantidadDias=this.optionsForm.controls.bannerSupDias.value+this.diasFinInf;
    this.anuncio.Banners.filter(x=>x.Tipo=='Superior movil')[0].CantidadDias=this.optionsForm.controls.bannerSupDias.value+this.diasFinInf;

    break;
}


( this.optionsForm.controls.destacadoCheck.value == true && this.optionsForm.controls.destacadoDias.value !== '' && this.optionsForm.controls.destacadoDias.value !== 0) ? this.total += this.optionsForm.controls.destacadoDias.value * this.precioDest : this.total = this.total;

  if( this.optionsForm.controls.descriptivoCheck.value == true && this.optionsForm.controls.descriptivoDias.value !== '' && this.optionsForm.controls.descriptivoDias.value !== 0)
  {
    this.total += this.optionsForm.controls.descriptivoDias.value * this.precioDesc ;
   }
  if( this.optionsForm.controls.autorrenovableCheck.value == true && this.optionsForm.controls.autorrenovableDias.value !== '' && this.optionsForm.controls.autorrenovableDias.value !== 0)
  {
    this.total += this.optionsForm.controls.autorrenovableDias.value * this.precioAutorr ;
  }

  // this.optionsForm.controls.autorrenovableDias.value != '' ? this.total += this.optionsForm.controls.autorrenovableDias.value * this.precioAutorr : this.total = this.total;
    (this.optionsForm.controls.webCheck.value == true &&  this.optionsForm.controls.webDias.value != '' )? this.total += this.optionsForm.controls.webDias.value * this.precioWeb : this.total = this.total;
     ( this.optionsForm.controls.imagenCheck.value == true && this.optionsForm.controls.imagenDias.value != '') ? this.total += this.optionsForm.controls.imagenDias.value * this.precioImg : this.total = this.total;
     (this.optionsForm.controls.bannerInfCheck !== undefined && this.optionsForm.controls.bannerInfCheck.value == true && this.optionsForm.controls.bannerInfDias.value != '') ? this.total += this.optionsForm.controls.bannerInfDias.value * this.precioInf : this.total = this.total;
     (this.optionsForm.controls.bannerSupCheck.value == true && this.optionsForm.controls.bannerSupDias.value != '') ? this.total += this.optionsForm.controls.bannerSupDias.value * this.precioSup : this.total = this.total;
  if (this.currentUser!=null)
  {
    //Zuleidy validar q el usuario tenga puntos suficientes para comprar las opciones avanzadas seleccionadas
    if ((this.total!=0)&&(this.anuncio.Usuario.Puntos < this.total)){
      this.toastr.error('Ud. no tiene suficientes puntos, debe comprar puntos.', 'Anuncio');
      this.comprarPutnos = true;
      this.submitted = false;
    }
    else {
      this.comprarPutnos = false;
      this.submitted = true;
    }
  }

  }

  ExisteOpcion(codigo: string): boolean {
    if (this.anuncio.OpcionesAvanzadas.filter(x => x.NombreCodigo === codigo).length > 0) {
      return true;
    }
    return false;
  }


  onSubmitData(): void {



    this.submitted = true;
// this.anuncio.OpcionesAvanzadas = [];
// this.anuncio.Banners = [];
    this.anuncio.AlmacenImagen = [];

// zuleidy Captcha
    this.anuncio.Captcha = this.captcha.value;

    /*---------------- Insertar solo anuncio Deivis --------------------*/
    if (this.ListaAcciones.indexOf(this.anuncio.Accion) < 0) {
      this.anuncio.Accion = this.ListaAcciones[0];
    }


    if (this.optionsForm.controls.webCheck.value === true && this.optionsForm.controls.web.value === 'https://setvmas.com') {
      this.toastr.error('La url del enlace web es incorrecta.', 'Anuncio');
      this.submitted = false;
    }

    if ( (this.anuncio.CorreoContacto !== null || this.anuncio.CorreoContacto.trim() !== '') &&
      !this.esEmailValido(this.anuncio.CorreoContacto)) {
      this.toastr.error('La dirección de correo no es válida. (ej: correo1@setvmas.com)', 'Anuncio');
      this.submitted = false;
    }

    if (this.optionsForm.controls.descriptivoCheck.value === true && this.anuncio.Etiquetas.filter(x => x.IsFree === false).length === 0) {
      this.toastr.error('Debe insertar alguna etiqueta.', 'Anuncio');
      this.submitted = false;
    }

    if (this.optionsForm.controls.bannerSupCheck.value === true && (document.getElementById('fileUploadImageDesktop1').getAttribute('src') === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=' ||
      document.getElementById('fileUploadImageMovil1').getAttribute('src') === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=')) {
      this.toastr.error('Debe insertar dos imágenes para el banner superior.', 'Anuncio');
      this.submitted = false;
    }


    if ( this.anuncio.Precio.toString().length > 7) {
      this.toastr.error('El precio debe tener un máximo de 7 cifras.', 'Anuncio');
      this.submitted = false;
    }

    if (!this.optionsForm.invalid && this.submitted)
    {
       const fechaDesact: Date = new Date();

       if (this.componentsFree.length > 0) {
         for (var i = 0; i < this.componentsFree.length; i++) {
           this.anuncio.AlmacenImagen.push(new Almacenimagen(0, this.componentsFree[i].instance.urlImg, this.componentsFree[i].instance.urlImg, this.getImageType(this.componentsFree[i].instance.urlImg), this.componentsFree[i].instance.name, this.anuncio.AnuncioId, true, this.componentsFree[i].instance.srcOrientation));
         }
       }


      if (this.components.length > 0) {
        for (var i = 0; i < this.components.length; i++) {

          this.anuncio.AlmacenImagen.push(new Almacenimagen(0, this.components[i].instance.urlImg, this.components[i].instance.urlImg,
            this.getImageType(this.components[i].instance.urlImg), this.components[i].instance.name, this.anuncio.AnuncioId,
            false, this.components[i].instance.srcOrientation));
        }
      }



      /*   if (this.components.length > 0) {
           for (var i = 0; i < this.components.length; i++) {
             if (this.components[i].instance.fileData != null) {
              // const imagen = this.components[i].instance.urlImg;

            const imagen = document.getElementById(this.components[i].instance.idImg).getAttribute('src');
            this.anuncio.AlmacenImagen.push(new Almacenimagen(0, imagen, imagen, this.components[i].instance.fileData.type, this.components[i].instance.fileData.name, this.anuncio.AnuncioId, false));
          }
          else {
          // const imagen = this.components[i].instance.urlImg;
            const imagen = document.getElementById(this.components[i].instance.idImg).getAttribute('src');

               this.anuncio.AlmacenImagen.push(new Almacenimagen(0, imagen, imagen, this.getImageType(imagen), this.components[i].instance.name, this.anuncio.AnuncioId, false));
             }
           }
         }*/

      if (this.optionsForm.controls.web.value !== '' ) {
        const text = this.optionsForm.controls.web.value.toString().indexOf('//');
        if (text <= 1 ) {

          this.anuncio.Url = 'http://' + this.optionsForm.controls.web.value;
        } else {

          this.anuncio.Url = this.optionsForm.controls.web.value;
        }



      }


      if(this.total>0)
        this.anuncio.Usuario.Puntos=this.anuncio.Usuario.Puntos-this.total;

       if (this.anuncio.AnuncioId == 0) {
         this.loadingIndicator.showLoading(true);

         this.service.postAnunciosV2(this.anuncio).then(
           res => {

             this.loadingIndicator.showLoading(false);
             this.toastr.success('El anuncio ha sido insertado correctamente.', 'Anuncios');
             //this.servBA.updateAnuncioReciente.next(true);
             this.service.insertoAnuncio.next(true);
             this.updateCurrentUser();
	     this.onCloseClick();


         },
           err => {
             this.toastr.error('Error durante la actualización.', 'Anuncios');
             this.loadingIndicator.showLoading(false);
           }
         );
       }
       else
       {
         this.loadingIndicator.showLoading(true);
         this.service.putAnunciosV2(this.anuncio).then(
           res => {
             this.loadingIndicator.showLoading(false);
             this.toastr.success('El anuncio ha sido modificado correctamente.', 'Anuncios');

             //this.servBA.updateAnuncioReciente.next(true);
             this.service.insertoAnuncio.next(true);
             this.updateCurrentUser();
	 this.onCloseClick();
           },
           err => {
             this.toastr.error('Error durante la actualización.', 'Anuncios');
             this.loadingIndicator.showLoading(false);
           }
         );
       }
    }

    /*---------------- Insertar solo anuncio Deivis --------------------*/



  }

  getImageType(image: string) :string{
    var result = image.split(':', 2)[1];
    result = result.split(';', 2)[0];
    return result;

  }


  getCodigoByFrec() {
    //var codigo;
    //switch (this.optionsForm.controls.frecuencia.value) {
    //  case 'Cada 24 horas':
    //    codigo = 'AUTO_24';
    //    break;
    //  case 'Cada 6 horas':
    //    codigo = 'AUTO_6';
    //    break;
    //  case 'Cada 1 hora':
    //    codigo = 'AUTO_1';
    //    break;
    //  default:
    //    codigo = 'AUTO_TOP';
    //    break;
    //}
    return this.listaFrecAutoRenovables.find(x => x.Nombre == this.optionsForm.controls.frecuencia.value).NombreCodigo;

  }

  // Open Modal DirectPurchase
  openDialogDirectPurchase(): void {
    this.onCloseClick();
    const dialogRef = this.dialog.open(DirectPurchaseComponent, {
      width: '850px',
      height: '470px',
    });

    this.document.body.classList.add('noscroll');

    dialogRef.afterClosed().subscribe(result => {
      this.document.body.classList.remove('noscroll');

    });

  }

  deleteImgSelected(){
    this.anuncio.ImageContent = null;
    this.anuncio.ImageName = null;
    this.fileData = null;
  }

  onOpenFileUpload(uploadName): void {
    this.document.getElementById(uploadName).click();
  }


  girar(uploadName: string) {

    if (this.fileData) {
      if (this.srcOrientation === 1) {
        this.srcOrientation = 6;
        this.preview(uploadName, this.srcOrientation);

      } else
      if (this.srcOrientation === 6) {
        this.srcOrientation = 3;
        this.preview(uploadName, this.srcOrientation);
      } else
      if (this.srcOrientation === 3) {
        this.srcOrientation = 8;
        this.preview(uploadName, this.srcOrientation);
      } else
      if (this.srcOrientation === 8) {
        this.srcOrientation = 1;
        this.preview(uploadName, this.srcOrientation);
      }
    }

  }
  fileProgress(fileInput: any, uploadName: string) {
    this.fileData = <File>fileInput.target.files[0];

    if (this.fileData) {
      this.srcOrientation =  1 ;
      this.preview(uploadName, this.srcOrientation);
    }

  }

  preview(uploadName, srcO) {
    // Show preview

    const mimeType = this.fileData.type;
    var width: number = 0;
    var height: number = 0;
    if (mimeType.match(/image\/*/) == null) {

      return;
    }
var size = this.fileData.size / 4024;
  if (size > 4096)
  {
    this.toastr.error('El tamaño supera el límite permitido (4MB).', 'Anuncio');
    return;
  }

    // if (bmp.Width > 800 || bmp.Height > 600) { // No Graba la imagen al servidor }
    switch (uploadName) {
      case 'fileUploadImageSimple':
        this.anuncio.ImageMimeType = mimeType;
        this.anuncio.ImageName = this.fileData.name;
        // this.readImage(174, 130, uploadName);
        height = 350;
        width = 200;
        //  this.readImage(200, 200, uploadName);
        break;
      case 'fileUploadImageDesktop':
        this.imageMimeTypeDesktop = mimeType; // Zuleidy tipo de la imagen desktop
        this.imageNameDesktop = this.fileData.name; // Zuleidy nombre de la imagen desktop

        this.anuncio.Banners.filter( x => x.Tipo === 'Superior escritorio')[0].ImageMimeType = mimeType;
        this.anuncio.Banners.filter(x => x.Tipo === 'Superior escritorio')[0].ImageName = this.fileData.name;

         // this.readImage(1920, 270, uploadName);
        height = 1170;
        width = 166;
        // this.readImage(1170, 166, uploadName);//Zuleidy tamaño de la imagen desktop
       break;
     case 'fileUploadImageMovil':
        this.imageMimeTypeMobil = mimeType; // Zuleidy tipo de la imagen mobil
        this.imageNameMobil = this.fileData.name; // Zuleidy nombre de la imagen mobil
       this.anuncio.Banners.filter(x => x.Tipo === 'Superior movil')[0].ImageMimeType = mimeType;
       this.anuncio.Banners.filter(x => x.Tipo === 'Superior movil')[0].ImageName = this.fileData.name;
       // this.readImage(400, 204, uploadName);
        height = 322;
        width = 166;
       // this.readImage(322, 166, uploadName);//Zuleidy tamaño de la imagen mobil
       break;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);

    reader.onload = ( _event ) => {
      switch (uploadName) {
        case 'fileUploadImageDesktop':
          this.optionsForm.patchValue({
            imageDesk: reader.result.toString()
          });
          break;
        case 'fileUploadImageMovil':
          this.optionsForm.patchValue({
            imageMov: reader.result.toString()
          });
          break;
      }
     // if (!this.optionsForm.controls.imageDesk.invalid && !this.optionsForm.controls.imageMov.invalid && !this.optionsForm.controls.imageInf.invalid) {
        this.readImage(reader.result.toString(), width, height, uploadName, srcO);

     // }



    };


  }


getUrlImage(name, container){
    if (name)
      return this.servCo.getSiteUrl() + container + '/' + encodeURI(name);
    else
      return '';
}

  readImage(src, width, height, uploadName, srcO): any {
    var loading = false;
    const image = new Image();

    image.src = src;
    console.log(image.width);
    const objetoThis = this;
    image.onload = function () {

      if (!loading) {

        if (uploadName === 'fileUploadImageSimple') {
          loading = true;
          // var canvas= <HTMLCanvasElement>  document.createElement('canvas');
          var canvas = <HTMLCanvasElement> document.getElementById('micanvas');
          var context = canvas.getContext('2d');

         /* var canvas2 = <HTMLCanvasElement> document.getElementById('micanvas2');
          var context2 = canvas2.getContext('2d');
          const M1 = image.height;
          const N1 = image.width;
         const R = N1 / M1;
         let h = 540;
         let w = Math.ceil(R * h);

          var scale2 = Math.min(canvas2.width / image.width, canvas2.height / image.height);
          // get the top left position of the image
          var x2 = (canvas2.width / 2) - (image.width / 2) * scale2;
          var y2 = (canvas2.height / 2) - (image.height / 2) * scale2;

          if (4 < srcO && srcO < 9) {
            canvas2.width = h;
            canvas2.height = w;
          } else {
            canvas2.width = w;
            canvas2.height = h;
          }

          // transform context before drawing image
          switch (srcO) {
            case 2: context2.transform(-1, 0, 0, 1, w, 0); break;
            case 3: context2.transform(-1, 0, 0, -1, w, h ); break;
            case 4: context2.transform(1, 0, 0, -1, 0, h ); break;
            case 5: context2.transform(0, 1, 1, 0, 0, 0); break;
            case 6: context2.transform(0, 1, -1, 0, h , 0); break;
            case 7: context2.transform(0, -1, -1, 0, h , w); break;
            case 8: context2.transform(0, -1, 1, 0, 0, w); break;
            default: break;
          }*/



          canvas.width = width;
          canvas.height = height;

          // Zuleidy Ajustar Imagen
          var scale = Math.min(canvas.width / image.width, canvas.height / image.height);
          // get the top left position of the image
          var x = (canvas.width / 2) - (image.width / 2) * scale;
          var y = (canvas.height / 2) - (image.height / 2) * scale;



          // set proper canvas dimensions before transform & export
          if (4 < srcO && srcO < 9) {
            canvas.width = height;
            canvas.height = width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }

          // transform context before drawing image
          switch (srcO) {
            case 2: context.transform(-1, 0, 0, 1, width, 0); break;
            case 3: context.transform(-1, 0, 0, -1, width, height ); break;
            case 4: context.transform(1, 0, 0, -1, 0, height ); break;
            case 5: context.transform(0, 1, 1, 0, 0, 0); break;
            case 6: context.transform(0, 1, -1, 0, height , 0); break;
            case 7: context.transform(0, -1, -1, 0, height , width); break;
            case 8: context.transform(0, -1, 1, 0, 0, width); break;
            default: break;
          }

          //context.drawImage(image, x, y, image.width * scale, image.height * scale);
          context.drawImage(image, x, y, image.width * scale, image.height * scale);
          //context2.drawImage(image, x2, y2, canvas2.width * scale  , canvas2.height * scale);



          //image.src = canvas.toDataURL('image/jpeg');
        }
        else if ((uploadName == 'fileUploadImageDesktop' && image.naturalWidth == 1170 && image.naturalHeight == 166)
          || (uploadName == 'fileUploadImageMovil' && image.naturalWidth == 322 && image.naturalHeight == 166)) {
          var canvas = <HTMLCanvasElement>document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        }
        else if (uploadName == 'fileUploadImageDesktop' && (image.naturalWidth != 1170 || image.naturalHeight != 166)) {
          image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
          document.getElementById('fileUploadImageDesktop1').setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=');

        }
        else if (uploadName == 'fileUploadImageMovil' && (image.naturalWidth != 322 || image.naturalHeight != 166)) {
        image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
          document.getElementById('fileUploadImageMovil1').setAttribute('src', image.src);

        }
        loading = true;

      }

      switch (uploadName) {
        case 'fileUploadImageSimple':

          //image.src = canvas.toDataURL();
          objetoThis.previewUrl = canvas.toDataURL();
          if (objetoThis.previewUrl != null && objetoThis.previewUrl != undefined && objetoThis.previewUrl != '')
          //objetoThis.anuncio.ImageContent = canvas2.toDataURL().split(',', 2)[1];
          objetoThis.anuncio.Rotacion = srcO;
          break;
        case 'fileUploadImageDesktop':
          objetoThis.bannerDesktop = image.src;
          if(objetoThis.anuncio.Banners.filter(x=>x.Tipo=='Superior escritorio').length>0)
            objetoThis.anuncio.Banners.filter(x=>x.Tipo=='Superior escritorio')[0].ImageContent=image.src.split(',', 2)[1];;
          break;
        case 'fileUploadImageMovil':
          objetoThis.bannerMobil = image.src;
          if(objetoThis.anuncio.Banners.filter(x=>x.Tipo == 'Superior movil').length>0)
            objetoThis.anuncio.Banners.filter(x=>x.Tipo == 'Superior movil')[0].ImageContent=image.src.split(',', 2)[1];;

          break;
      }

    }
    this.previewUrl = image.src;
    this.anuncio.ImageContent = src.split(',', 2)[1];

       /* switch (uploadName) {
          case 'fileUploadImageSimple':
            console.log(this.previewUrl);
            console.log(3);
            this.previewUrl = image.src;
            this.anuncio.ImageContent = image.src.split(',', 2)[1];
            break;
          case 'fileUploadImageDesktop':
            this.bannerDesktop = image.src;
              if(this.anuncio.Banners.filter(x=>x.Tipo=='Superior escritorio').length>0)
                this.anuncio.Banners.filter(x=>x.Tipo=='Superior escritorio')[0].ImageContent=image.src.split(',', 2)[1];;
            break;
          case 'fileUploadImageMovil':
            this.bannerMobil = image.src;
            if(this.anuncio.Banners.filter(x=>x.Tipo=='Superior movil').length>0)
              this.anuncio.Banners.filter(x=>x.Tipo=='Superior movil')[0].ImageContent=image.src.split(',', 2)[1];;

            break;
        }*/

  }


  // autocomplete tags
  removeEti(fruit, indx): void {
    const etiq = this.ListaEti.splice(indx, 1)[0];
const index = this.anuncio.Etiquetas.findIndex(eti => eti.Nombre === etiq.Nombre);
    this.anuncio.Etiquetas.splice(index, 1);
    this.ListaEtiFuente.push(etiq);
  }

removeEti2(fruit, indx): void {

  const etiq = this.ListaEti2.splice(indx, 1)[0];
const index = this.anuncio.Etiquetas.findIndex(eti => eti.Nombre === etiq.Nombre);
this.anuncio.Etiquetas.splice(index, 1);
this.ListaEtiFuente2.push(etiq);
}


  addEti(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let etiquetaNew;
    let anuncioEti;

    // Add our fruit
    if ((value || '').trim() && this.ListaEti.filter(fruit => fruit.Nombre.toLowerCase() === value.trim().toLowerCase()).length === 0
      && this.ListaEtiFuente.filter(fruit => fruit.Nombre.toLowerCase() === value.trim().toLowerCase()).length > 0) {
      console.log('El valor entr: '+ value + 'ENTRO');
      const index = this.ListaEtiFuente.findIndex(eti => eti.Nombre.toLowerCase() === value.trim().toLowerCase());
      etiquetaNew = this.ListaEtiFuente.splice(index, 1)[0];
      anuncioEti = new AnuncioetiquetaModel(0, 0, 0, null, etiquetaNew, true);
      this.ListaEti.push(etiquetaNew);
      this.anuncio.Etiquetas.push(etiquetaNew);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.inputEtq.setValue(null);



  }


  addEti2(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let etiquetaNew;
    let anuncioEti;

    // Add our fruit
    if ((value || '').trim() && this.ListaEti2.filter(fruit => fruit.Nombre.toLowerCase() === value.trim().toLowerCase()).length === 0
      && this.ListaEtiFuente2.filter(fruit => fruit.Nombre.toLowerCase() === value.trim().toLowerCase()).length > 0) {

      const index = this.ListaEtiFuente2.findIndex(eti => eti.Nombre.toLowerCase() === value.trim().toLowerCase());
      etiquetaNew = this.ListaEtiFuente2.splice(index, 1)[0];
      anuncioEti = new AnuncioetiquetaModel(0, 0, 0, null, etiquetaNew, false);
      this.ListaEti2.push(etiquetaNew);
      this.anuncio.Etiquetas.push(etiquetaNew);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.inputEtq.setValue(null);

      console.log(this.anuncio.Etiquetas.length);

  }

  selectedEti(event: MatAutocompleteSelectedEvent): void {

    const value = event.option.value;

    let etiquetaNew;
    let anuncioEti;



if(this.anuncio.Etiquetas == null)
  this.anuncio.Etiquetas = [];



    // Add our fruit
    if (this.ListaEti.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length === 0
      && this.ListaEtiFuente.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length > 0) {

      if (this.ListaEti.length < this.maxEtiquetas ) {//&& this.optionsForm.controls.destacadoCheck.value !=true
        const index = this.ListaEtiFuente.findIndex(eti => eti.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase());
        etiquetaNew = this.ListaEtiFuente.splice(index, 1)[0];
        etiquetaNew.IsFree=true;
        this.anuncio.Etiquetas.push(etiquetaNew);
        this.ListaEti.push(etiquetaNew);
      }
      else
        this.toastr.error('Si desea insertar más etiquetas debe acceder a la opción Configuración Avanzada', 'Anuncio');
    }

    this.etiquInp.nativeElement.value = '';
    this.inputEtq.setValue(null);

  }
  selectedEti2(event: MatAutocompleteSelectedEvent): void {

    const value = event.option.value;

    let etiquetaNew;
    let anuncioEti;

    // Add our fruit
    if (this.ListaEti2.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length === 0
      && this.ListaEtiFuente2.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length > 0) {

      const index = this.ListaEtiFuente2.findIndex(eti => eti.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase());
      etiquetaNew = this.ListaEtiFuente2.splice(index, 1)[0];
      etiquetaNew.IsFree=false;
      this.anuncio.Etiquetas.push(etiquetaNew);

      this.ListaEti2.push(etiquetaNew);

    }

    this.etiquInp2.nativeElement.value = '';
  //  this.inputEtq2.setValue(null);
   // console.log(this.anuncio.Etiquetas.length);
  }

  // Advanced configuration
  onShowAdvancedConfiguration(): void {
    this.document.getElementById('simpleConfiguration').classList.add('hidden');
    this.document.getElementById('advancedConfiguration').classList.remove('hide');
    this.document.getElementById('advancedConfiguration').classList.remove('hidden');

  }
  onShowSimpleConfiguration(): void {
    this.document.getElementById('simpleConfiguration').classList.remove('hidden');
    this.document.getElementById('advancedConfiguration').classList.add('hide');
    this.document.getElementById('advancedConfiguration').classList.add('hidden');

  }
ngOnDestroy(): void {
  this.loadingAnuncio.complete();


}

  esEmailValido(email: string): boolean {
    let mailValido = false;
    'use strict';

    var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(EMAIL_REGEX)) {
      mailValido = true;
    }
    return mailValido;
  }




  // from http://stackoverflow.com/a/32490603
    setOrientation(file, callback) {
    var reader = new FileReader();

    reader.onload = function(event) {
      var view = new DataView(<ArrayBuffer>event.target.result);

      if (view.getUint16(0, false) != 0xFFD8) return callback(-2);

      var length = view.byteLength,
        offset = 2;

      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;

        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) {
            return callback(-1);
          }
          var little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;

          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + (i * 12), little) == 0x0112)
              return callback(view.getUint16(offset + (i * 12) + 8, little));
        }
        else if ((marker & 0xFF00) != 0xFF00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1);
    };

    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  };
  /*var originalImage = document.getElementById('image-original'),
  resetImage = document.getElementById('image-reset');

  resetOrientation(originalImage.src, 5, function(resetBase64Image) {
    resetImage.src = resetBase64Image;
  });*/


}




