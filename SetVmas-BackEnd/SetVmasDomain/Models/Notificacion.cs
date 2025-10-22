using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class Notificacion
    {
        public int NotificacionId { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string Motivo { get; set; }
        public string Descripcion { get; set; }
        public string Texto { get; set; }
        public int? UsuarioId { get; set; }
        public int? UsuarioCreaUsuarioId { get; set; }
        public int AnuncioId { get; set; }

        public Anuncios Anuncio { get; set; }
        public Usuario Usuario { get; set; }
        public Usuario UsuarioCreaUsuario { get; set; }
    }
}
