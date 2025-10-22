import {Categoria} from './categoria.model';
import {Etiqueta} from './etiqueta.model';


export class CategoriaEtiqueta {
  public CategoriaEtiquetaId: number;
  public EtiquetaId: number;
  public CategoriaId: number;
  public Categoria: Categoria;
  public Etiqueta: Etiqueta;
  constructor(
    etiquetaId: number,
    categoriaId: number
  ) {
    this.EtiquetaId=etiquetaId;
    this.CategoriaId=categoriaId
  }
}
