using System;
using System.Collections.Generic;
using System.Text;

namespace SetVmasDomain.Models
{
    public class AnuncioBonificado
    {
        public int AnuncioBonificadoId { get; set; }
        public int AnuncioId { get; set; }
        public int UsuarioId { get; set; }
        public DateTime FechaBoni { get; set; }
        public decimal CantidadBonificada { get; set; }
        //public Anuncios Anuncio { get; set; }
        //public Usuario Usuario { get; set; }
    }
}
