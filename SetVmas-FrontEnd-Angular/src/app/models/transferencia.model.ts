import { TipoTransferencia } from './tipo-transferencia.model';
import { Usuario } from './usuario.model';

export class Transferencia {
  constructor(
    public TransferId: number,
    public OperationDate: Date,
    public Points: number,
    public TransferType: string,
    public User: string,
    public SourceUser: string,
    public TargetUser: string

  ) { }
}
