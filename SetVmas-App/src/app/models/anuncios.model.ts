import { Banner } from './banner.model';
import { Opciones } from './opciones.model';
import { Usuario } from '../models/usuario.model';
import { Almacenimagen } from './almacenimagen.model';
import { Etiqueta } from './etiqueta.model';
import { Categoria } from './categoria.model';

export class AnunciosModel {
  constructor(
    public AnuncioId?: number,
    public Titulo?: string,
    public Descripcion?: string,
    public NombreContacto?: string,
    public TelefonoContacto?: string,
    public CorreoContacto?: string,
    public Precio?: number,
    public IsActivo?: boolean,
    public IsVisible?: boolean,
    public FechaCreacion?: Date,
    public FechaModificacion?: Date,
    public ImageContent?: string,
    public ImageMimeType?: string,
    public ImageName?: string,
    public Url?: string,
    public Provincia?: string,
    public Municipio?: string,
    public ContadorView?: number,
    public ProductoNuevo?: boolean,
    public Accion?: string,
    public Imagen?: string,
    public Tipo?: string


    // Opciones avanzadar
    // Lista Banner

    // public Usuario Usuario: string
  ) { }
  public Categoria?: Categoria;
  public Banners?: Banner[];
  public OpcionesAvanzadas?: Opciones[];
  public IsDestacado?: boolean;
  public IsWeb?: boolean;
  public Etiquetas: Etiqueta[];
  public Usuario?: Usuario;
  public AlmacenImagen?: Almacenimagen[];
  public Rotacion?: number;
  public Captcha?: string;

  static getEmpty() {
    return {
      Etiquetas: [],
      AlmacenImagen: [],
      AnuncioId: 0,
      ContadorView: 0,
      Banners: [],
      Descripcion: '',
      Imagen: '',
      IsActivo: false,
      IsVisible: false,
      Municipio: '',
      Provincia: '',
      ProductoNuevo: false,
      FechaCreacion: null,
      FechaModificacion: null,
      Accion: '',
      OpcionesAvanzadas: [],
      Tipo: '',
      Url: '',
      ImageContent: '',
      ImageMimeType: '',
      ImageName: '',
      IsDestacado: false,
      Titulo: '',
      Precio: null,
      CorreoContacto: '',
      NombreContacto: '',
      TelefonoContacto: '',
      Captcha: null
    };
  }
}

