using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class AlmacenImagen
    {
        public int AlmacenImagenId { get; set; }
        public string Imagen { get; set; }
        public string ImageContent { get; set; }
        public string ImageMimeType { get; set; }
        public string ImageName { get; set; }
        public int AnuncioId { get; set; }
        public bool? IsFree { get; set; }

        public Anuncios Anuncio { get; set; }
    }
}
