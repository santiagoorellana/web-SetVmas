using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class Pagos
    {
        public int PagoId { get; set; }
        public int TransferenciaId { get; set; }
        public string Tipo { get; set; }
        public decimal CantCup { get; set; }
        public DateTime Fecha { get; set; }
        public string Estado { get; set; }
        public decimal Puntos { get; set; }
        public int? UsuarioId { get; set; }
        public string Fuente { get; set; }

        public Usuario Usuario { get; set; }
    }
}
