using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class TipoTransferencia
    {
        public TipoTransferencia()
        {
            Transferencia = new HashSet<Transferencia>();
        }

        public int TipoTransferenciaId { get; set; }
        public string Nombre { get; set; }
        public string NombreCodigo { get; set; }
        public double Cantidad { get; set; }
        public string Descripcion { get; set; }

        public ICollection<Transferencia> Transferencia { get; set; }
    }
}
