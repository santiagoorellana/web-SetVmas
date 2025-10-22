using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class AnuncioEtiquetas
    {
        public int AnuncioEtiquetaId { get; set; }
        public int AnuncioId { get; set; }
        public int EtiquetaId { get; set; }
        public bool? IsFree { get; set; }

        public Anuncios Anuncio { get; set; }
        public Etiqueta Etiqueta { get; set; }
    }
}
