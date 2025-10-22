using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class Categoria
    {
        public Categoria()
        {
            CategoriaEtiqueta = new HashSet<CategoriaEtiqueta>();
        }

        public int CategoriaId { get; set; }
        public string Nombre { get; set; }
        public string Imagen { get; set; }
        public int CantAutoRenovables { get; set; }
        public string ImageContent { get; set; }
        public string ImageMimeType { get; set; }
        public string ImageName { get; set; }

        public ICollection<CategoriaEtiqueta> CategoriaEtiqueta { get; set; }
    }
}
