using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class Etiqueta
    {
        public Etiqueta()
        {
            AnuncioEtiquetas = new HashSet<AnuncioEtiquetas>();
            CategoriaEtiqueta = new HashSet<CategoriaEtiqueta>();
        }

        public int EtiquetaId { get; set; }
        public string Nombre { get; set; }
        public int CantUsada { get; set; }

        public ICollection<AnuncioEtiquetas> AnuncioEtiquetas { get; set; }
        public ICollection<CategoriaEtiqueta> CategoriaEtiqueta { get; set; }
    }
}
