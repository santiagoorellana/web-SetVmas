using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class CategoriaEtiqueta
    {
        public int CategoriaEtiquetaId { get; set; }
        public int EtiquetaId { get; set; }
        public int CategoriaId { get; set; }

        public Categoria Categoria { get; set; }
        public Etiqueta Etiqueta { get; set; }
    }
}
