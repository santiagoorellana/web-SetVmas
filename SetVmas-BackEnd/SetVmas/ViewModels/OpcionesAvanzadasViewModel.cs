using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class OpcionesAvanzadasViewModel
    {
        public int OpcionAvanzadaId { get; set; }
        public string TextoLabel { get; set; }
        public string NombreCodigo { get; set; }
        public double Precio { get; set; }
        public int CantidadFrecuencia { get; set; }
        public int MinimoComprar { get; set; }
        public int CantidadDias { get; set; }
        public DateTime? FechaDesactivacion { get; set; }
        public bool IsActivo { get; set; }
        public int AnuncioId { get; set; }
        public int? TipoOpcionId { get; set; }


    }
}
