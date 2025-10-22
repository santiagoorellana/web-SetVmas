using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class CondicionesViewModel
    {
        public string Condiciones { get; set; }       
        public decimal  BRONCE { get; set; }
        public decimal PLATA { get; set; }
        public decimal ORO { get; set; }
        public decimal DIAMANTE { get; set; }

        public CondicionesViewModel(string nombre)
        {
            Condiciones = nombre;
        }
    }
}
