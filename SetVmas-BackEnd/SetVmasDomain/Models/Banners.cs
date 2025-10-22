using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class Banners
    {
        public Banners()
        {
            Denuncias = new HashSet<Denuncias>();
        }

        public int BannerId { get; set; }
        public string Nombre { get; set; }
        public string Url { get; set; }
        public string Tipo { get; set; }
        public int CantidadDias { get; set; }
        public string ImageContent { get; set; }
        public string ImageMimeType { get; set; }
        public string ImageName { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaUltView { get; set; }
        public DateTime? FechaDesactivacion { get; set; }
        public bool IsActivo { get; set; }
        public int AnuncioId { get; set; }

        public Anuncios Anuncio { get; set; }
        public ICollection<Denuncias> Denuncias { get; set; }
    }
}
