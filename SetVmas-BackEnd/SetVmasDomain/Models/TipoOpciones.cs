using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class TipoOpciones
    {
        public TipoOpciones()
        {
            OpcionAvanzadas = new HashSet<OpcionAvanzadas>();
        }

        public int TipoOpcionId { get; set; }
        public string Nombre { get; set; }
        public string NombreCodigo { get; set; }
        public string TextoLabel { get; set; }
        public double Precio { get; set; }
        public int CantidadFrecuencia { get; set; }
        public int MinimoComprar { get; set; }

        public ICollection<OpcionAvanzadas> OpcionAvanzadas { get; set; }
    }
}
