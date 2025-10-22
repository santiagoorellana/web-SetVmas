import {Etiqueta} from './etiqueta.model';

export class Categoria {
  constructor(public CategoriaId: number,
              public Nombre: string,
              public ImageContent: any,
              public ImageMimeType: string,
              public ImageName: string,
              public CantAutoRenovables: number

  ) {
  }
    public Etiquetas: Etiqueta[];
}
