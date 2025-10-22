using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class ClasesUsuarios
    {
        public ClasesUsuarios()
        {
            Usuario = new HashSet<Usuario>();
        }

        public int ClasesUsuariosId { get; set; }
        public string Nombre { get; set; }
        public double FactorBonificacionCompra { get; set; }
        public double BonificacionPorAlcanzarla { get; set; }
        public double BonificacionPorAnuncioDiario { get; set; }
        public int RequisitoAntigueda { get; set; }
        public int RequisitoCompras { get; set; }
        public int RequisitoCantidadReferidos { get; set; }
        public decimal? RequisitoPuntos { get; set; }

        public ICollection<Usuario> Usuario { get; set; }
    }
}
