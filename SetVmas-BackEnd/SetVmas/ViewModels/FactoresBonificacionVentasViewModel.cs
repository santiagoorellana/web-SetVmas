using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class FactoresBonificacionVentasViewModel
    {     
        public string Nombre { get; set; }
        public double DIAMANTE { get; set; }
        public double ORO { get; set; }
        public double PLATA { get; set; }
        public double BRONCE { get; set; }
        public double INICIADO { get; set; }

        public FactoresBonificacionVentasViewModel(string nom, double diamante, double oro, double plata, double bronce, double iniciado)
        {
            Nombre = nom;
            DIAMANTE = Math.Round( diamante *100,2);
            ORO = Math.Round(oro * 100, 2); 
            PLATA = Math.Round(plata * 100, 2); 
            BRONCE = Math.Round(bronce * 100, 2); 
            INICIADO = Math.Round(iniciado * 100, 2);
        }
    }
}
