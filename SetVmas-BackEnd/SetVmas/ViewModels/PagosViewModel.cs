using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class PagosViewModel
    {
        public int PagoId { get; set; }
        public int TransferenciaId { get; set; }
        public string Tipo { get; set; }
        public decimal CantCup { get; set; }
        public DateTime Fecha { get; set; }
        public string Estado { get; set; }
        public decimal Puntos { get; set; }
        public string Fuente { get; set; }
        public string Usuario { get; set; }

    }
}
