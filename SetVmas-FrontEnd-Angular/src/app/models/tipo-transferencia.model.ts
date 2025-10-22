export class TipoTransferencia {

  public NombreCodigo: string
  constructor(
    public TipoTransferenciaId: number,
    public Nombre: string,
    public Cantidad: number,
    public Descripcion: string,
   ) { }
}
