import {Component, OnInit} from '@angular/core';
import {AnunciosModel} from '../../../models/anuncios.model';
import {MotivoDenuncia} from '../../../models/motivo-denuncia.model';
import { Denuncia } from 'src/app/models/denuncia.model';
import {Usuario} from '../../../models/usuario.model';
// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AnunciosService} from '../../../services/advert/anuncios.service';
import {MotivoDenunciaService} from '../../../services/motive-denounce/motivo-denuncia.service';
import {DenunciaService} from '../../../services/denounce/denuncia.service';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import { state } from '@angular/animations';
import {ConfiguracionesService} from '../../../services/configuration/configuration.service';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import { Almacenimagen } from '../../../models/almacenimagen.model';


@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.css']
})
export class AdDetailsComponent implements OnInit {

  // constructor(
  //   private router: Router,
  //   private route: ActivatedRoute,
  //   public servAnun: AnunciosService ) { }

  // ngOnInit() {
  //   const id = 'id';
  //   this.servAnun.getAnunciosByid(this.route.snapshot.params[id]);
  //   console.log(this.servAnun.formData);
  // }

  tags: string[] = ['fotógrafo', 'estudio', 'videoclip', 'publicidad', 'tienda virtual', 'marketplace', 'barbero'];

  // tags2: string[] = ['Destacado', 'Multietiqueta', 'Autorrenovable', 'Web', 'Superbanner', 'Banner'];
  tags2: string[] = [];
  denunce: any = false;
  listaMotivos: MotivoDenuncia[] = [];
  motivo: MotivoDenuncia;
  imgsAnunce: string[] = ['../../../../../assets/images/imagen-anuncio1.png',
    '../../../../../assets/images/imagen-anuncio2.png',
    '../../../../../assets/images/imagen-anuncio3.png',
    '../../../../../assets/images/imagen-anuncio1.png',
    '../../../../../assets/images/imagen-anuncio2.png',
    '../../../../../assets/images/imagen-anuncio3.png'];

  anuncio: AnunciosModel;
  currentUser: Usuario;
  state = false;

  urlImg: any;


  constructor(public servAnun: AnunciosService,
              private router: Router, private actRoute: ActivatedRoute,
              public serviceMD: MotivoDenunciaService, public serviceDenuncia: DenunciaService,
              private authenticationService: AuthenticationService,
              private servConfiguracion: ConfiguracionesService, private domSanitizer: DomSanitizer,
              public titleService: Title, public metaService: Meta) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    // console.log('datos que llegan ' + JSON.stringify(data.anuncio))

    // this.anuncio = data.anuncio;
    const id = 'id';
   /* Promise.all([
      this.servAnun.getAnunciosByidV2(this.actRoute.snapshot.params[id])
    ]).then(()=> {
      this.anuncio = this.servAnun.formData;
      this.llenarEtiquetasSegunOpciones(this.anuncio);
    })*/

    this.servAnun.getAnunciosByidV2(this.actRoute.snapshot.params[id])
     .then(res => {
      this.anuncio = res as AnunciosModel;
      this.llenarEtiquetasSegunOpciones(this.anuncio);
      const cat = this.anuncio.Categoria !== null ? this.anuncio.Categoria.Nombre : ' ';
      const descp = this.anuncio.Descripcion != null ? this.anuncio.Descripcion.slice(0, 120) : '';
      let etis = '';
      if (this.anuncio.Etiquetas !== null) {

        for (let i = 0; i < this.anuncio.Etiquetas.length ; i++) {
           if ( i === 0 ) {
             etis = this.anuncio.Etiquetas[i].Nombre;
           } else {
             etis = etis + ', ' + this.anuncio.Etiquetas[i].Nombre;
           }
        }
      }
       this.metaService.removeTag("name='description'");
       this.metaService.removeTag("name='keywords'");
       this.titleService.setTitle(this.anuncio.Titulo + ' - Setvmás');
       this.metaService.addTag( { name: 'author', content:'Setvmás' });
       this.metaService.addTag( { name: 'description', content:  descp + ', en ' + this.anuncio.Municipio + ', ' + this.anuncio.Provincia });
       this.metaService.addTag( { name: 'keywords', content: cat + ', ' + etis});



     });

    this.serviceMD.getMotivoDenuncia('Nombre', '', 'asc', 1, 5000)
      .subscribe(res => {
        this.listaMotivos = res as MotivoDenuncia[];
        this.motivo = this.listaMotivos[0];
      });
  }

  /*getUrl(): string{
    var url = "";
    if(this.anuncio.ImageName)
      url = <string>this.domSanitizer.
      bypassSecurityTrustUrl(this.servConfiguracion.getSiteUrl() + 'anuncios/' + this.anuncio.ImageName);
    else
      url = <string>this.domSanitizer.
      bypassSecurityTrustUrl(this.servConfiguracion.getSiteUrl() + 'categorias/' + this.anuncio.Categoria.ImageName);

    return  url;
  }*/

  ngOnInit() {

    // const id = 'id';
    // this.servAnun.getAnunciosByid(this.actRoute.snapshot.params[id]);
    // console.log('ANUNCIO ' + this.servAnun.formData.Titulo);
    // this.anuncio =  this.servAnun.formData;
  //  console.log('TITULO' + this.anuncio.Titulo);
    // this.state = true;

   /* this.servAnun.verAnuncio.subscribe(res => {
      console.log('this.anuncio2', this.anuncio);
      this.llenarEtiquetasSegunOpciones(this.anuncio);

     /* if (this.anuncio.ImageContent !== undefined && this.anuncio.ImageContent != null) {
        this.anuncio.Imagen = 'data:' + this.anuncio.ImageMimeType + ';base64,' + this.anuncio.ImageContent;
        this.readImage(200, 350);
      } else {
        this.anuncio.Imagen = this.anuncio.Categoria.Imagen;
      }

    });*/
  }

  onDenunciarClick(): void {
    this.serviceDenuncia.postDenuncia(new Denuncia(0, 'Sin Clasificar', new Date(), new Date(), this.motivo.MotivoDenunciaId, this.currentUser.UsuarioId, this.anuncio.AnuncioId));
    // this.dialogRef.close();
  }

  changeMotivo(m: MotivoDenuncia) {
    this.motivo = m;
  }


  llenarEtiquetasSegunOpciones(anuncio: AnunciosModel) {
    if (anuncio != null && anuncio.OpcionesAvanzadas != null && anuncio.OpcionesAvanzadas.length > 0) {
      let isAuto = false;
      this.tags2 = [];
      for (const opcion of anuncio.OpcionesAvanzadas) {
        if (opcion.NombreCodigo === 'DESTACADO') {
          this.tags2.push('Destacado');
        } else if (opcion.NombreCodigo === 'ETIQUETAS') {
          this.tags2.push('Multietiqueta');
        } else if (!isAuto && (opcion.NombreCodigo === 'AUTO_24' ||
          opcion.NombreCodigo === 'AUTO_6' || opcion.NombreCodigo === 'AUTO_1' ||
          opcion.NombreCodigo === 'AUTO_TOP'|| opcion.NombreCodigo === 'AUTO_TOP' ||
          opcion.NombreCodigo === 'AUTO_3' || opcion.NombreCodigo === 'AUTO_30')) {
          isAuto = true;
          this.tags2.push('Autorrenovable');
        } else if (opcion.NombreCodigo === 'MI_WEB') {
          this.tags2.push('Web');
        } else if (opcion.NombreCodigo === 'BAN_INF') {
          this.tags2.push('Banner');
        } else if (opcion.NombreCodigo === 'BAN_SUP') {
          this.tags2.push('Superbanner');
        } else if (opcion.NombreCodigo === 'IMG_ADI') {
          this.tags2.push('Imágenes Adicionales');
        }
      }
    }


  }

  reportAnunce() {
    this.denunce = true;
  }

  readImage( width, height): any {

    const image = new Image();
    image.src = 'data:' + this.anuncio.ImageMimeType + ';base64,' + this.anuncio.ImageContent;

    image.onload = function () {
      // var canvas= <HTMLCanvasElement>  document.createElement('canvas');
      var canvas = <HTMLCanvasElement>document.getElementById("micanvas1");
      var context = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      //Zuleidy Ajustar Imagen
      var scale = Math.min(canvas.width / image.width, canvas.height / image.height);
      // get the top left position of the image
      var x = (canvas.width / 2) - (image.width / 2) * scale;
      var y = (canvas.height / 2) - (image.height / 2) * scale;
      context.drawImage(image, x, y, image.width * scale, image.height * scale);
    }

  }
  setImageAlmacenName(img){
    this.urlImg =(img as Almacenimagen).ImageName;
  }
  getUrl(name, container):string{
    var url = "";
    if(name)
      url =<string>this.domSanitizer.
          bypassSecurityTrustUrl(this.servConfiguracion.getSiteUrl() + container+ "/" + encodeURI(name));
    else
      return "";
    return url;
  }

}
