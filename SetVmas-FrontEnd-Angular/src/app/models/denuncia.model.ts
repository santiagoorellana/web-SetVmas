import { MotivoDenuncia } from './motivo-denuncia.model';
import { AnunciosModel } from './anuncios.model';
import { Usuario } from './usuario.model';
import { Banner } from './banner.model';

export class Denuncia {
  constructor(
    public DenunciaId: number,
    public Estado: string,
    public FechaCreacion: Date,
    public FechaModificacion: Date,
    public MotivoDenunciaId: number,
    public UsuarioId: number,
    public AnuncioId: number
  ) { }
  public Correo: string;
  public Titulo: string;
  public MotivoDenuncia: string;
  public Codigo: string;
  public AnuncioUsuarioId: number;
  public UsuarioClasificaId: number;


}


