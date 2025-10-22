using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class AlmacenImagenViewModel
    {
        public int AlmacenImagenId { get; set; }
        public string Imagen { get; set; }
        public string ImageContent { get; set; }
        public string ImageMimeType { get; set; }
        public string ImageName { get; set; }
        public int AnuncioId { get; set; }
        public bool? IsFree { get; set; }
        public int Rotacion { get; set; }

    }
}
