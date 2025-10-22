using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class Denuncias
    {
        public int DenunciaId { get; set; }
        public string Estado { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int? MotivoDenunciaId { get; set; }
        public int? UsuarioId { get; set; }
        public int? AnuncioId { get; set; }
        public int? BannerId { get; set; }

        public Anuncios Anuncio { get; set; }
        public Banners Banner { get; set; }
        public MotivoDenuncia MotivoDenuncia { get; set; }
        public Usuario Usuario { get; set; }
    }
}
