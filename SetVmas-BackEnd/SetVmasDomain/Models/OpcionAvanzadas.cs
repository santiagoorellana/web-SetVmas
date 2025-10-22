using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class OpcionAvanzadas
    {
        public int OpcionAvanzadaId { get; set; }
        public int CantidadDias { get; set; }
        public DateTime? FechaDesactivacion { get; set; }
        public bool IsActivo { get; set; }
        public int AnuncioId { get; set; }
        public int? TipoOpcionId { get; set; }

        public Anuncios Anuncio { get; set; }
        public TipoOpciones TipoOpcion { get; set; }
    }
}
