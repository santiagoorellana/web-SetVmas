using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class BonificacionesViewModel
    {
        public string Bonificaciones { get; set; }
        public double INICIADO { get; set; }
        public double BRONCE { get; set; }
        public double PLATA { get; set; }
        public double ORO { get; set; }
        public double DIAMANTE { get; set; }

        public BonificacionesViewModel(string nombre)
        {
            Bonificaciones = nombre;
        }
    }
}
