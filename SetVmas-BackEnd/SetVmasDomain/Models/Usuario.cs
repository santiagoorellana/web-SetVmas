using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class Usuario
    {
        public Usuario()
        {
            Anuncios = new HashSet<Anuncios>();
            Denuncias = new HashSet<Denuncias>();
            NotificacionUsuario = new HashSet<Notificacion>();
            NotificacionUsuarioCreaUsuario = new HashSet<Notificacion>();
            Pagos = new HashSet<Pagos>();
            TransferenciaUsuario = new HashSet<Transferencia>();
            TransferenciaUsuarioDestinoUsuario = new HashSet<Transferencia>();
            TransferenciaUsuarioFuenteUsuario = new HashSet<Transferencia>();
        }

        public int UsuarioId { get; set; }
        public string Codigo { get; set; }
        public string Correo { get; set; }
        public string Password { get; set; }
        public string Url { get; set; }
        public string Telefono { get; set; }
        public string Edad { get; set; }
        public string Direccion { get; set; }
        public string Municipio { get; set; }
        public string Provincia { get; set; }
        public string Rol { get; set; }
        public decimal Puntos { get; set; }
        public int CantReferidos { get; set; }
        public bool Activo { get; set; }
        public bool Bloqueado { get; set; }
        public string Anfitrion { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public DateTime? FechaUltimaEntrada { get; set; }
        public DateTime? FechaDesbloqueo { get; set; }
        public DateTime? FechaUltimoAnuncio { get; set; }
        public DateTime? FechaUltimaView { get; set; }
        public int? ClasesUsuariosId { get; set; }
        public bool? Visible { get; set; }

        public ClasesUsuarios ClasesUsuarios { get; set; }
        public ICollection<Anuncios> Anuncios { get; set; }
        public ICollection<Denuncias> Denuncias { get; set; }
        public ICollection<Notificacion> NotificacionUsuario { get; set; }
        public ICollection<Notificacion> NotificacionUsuarioCreaUsuario { get; set; }
        public ICollection<Pagos> Pagos { get; set; }
        public ICollection<Transferencia> TransferenciaUsuario { get; set; }
        public ICollection<Transferencia> TransferenciaUsuarioDestinoUsuario { get; set; }
        public ICollection<Transferencia> TransferenciaUsuarioFuenteUsuario { get; set; }
    }
}
