import { Usuario } from './usuario.model';

export class Pago {
  public PagoId: number;
  public TransferenciaId: number;
  public Tipo: string;
  public CantCup: number;
  public Fecha: Date;
  public Estado: string;
  public Usuario: Usuario;
  public Fuente: string;
}
