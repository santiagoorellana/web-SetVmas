import { AnunciosModel } from './anuncios.model';
import { TipoOpcionModel } from './tipo-opcion.model';
export class Opciones {
  constructor(
    public OpcionAvanzadaId: number,
    public TextoLabel: string,
    public NombreCodigo: string,
    public Precio: number,
    public CantidadFrecuencia: number,
    public MinimoComprar: number,
    public CantidadDias: number,
    public FechaDesactivacion: Date,
    public IsActivo: boolean,
    public AnuncioId: number,
    public TipoOpcionId: number
) { }
}

