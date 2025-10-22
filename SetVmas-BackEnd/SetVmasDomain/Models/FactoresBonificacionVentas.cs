using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class FactoresBonificacionVentas
    {
        public int FactoresBonificacionVentasId { get; set; }
        public int Nivel { get; set; }
        public double ClaseDiamante { get; set; }
        public double ClaseOro { get; set; }
        public double ClasePlata { get; set; }
        public double ClaseBronce { get; set; }
        public double ClaseIniciada { get; set; }
    }
}
