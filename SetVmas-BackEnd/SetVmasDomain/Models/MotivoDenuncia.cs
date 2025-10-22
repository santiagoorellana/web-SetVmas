using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class MotivoDenuncia
    {
        public MotivoDenuncia()
        {
            Denuncias = new HashSet<Denuncias>();
        }

        public int MotivoDenunciaId { get; set; }
        public string Nombre { get; set; }
        public string NombreCodigo { get; set; }
        public string Estado { get; set; }

        public ICollection<Denuncias> Denuncias { get; set; }
    }
}
