using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class Transferencia
    {
        public int TransferenciaId { get; set; }
        public int? UsuarioId { get; set; }
        public int? UsuarioFuenteUsuarioId { get; set; }
        public int? UsuarioDestinoUsuarioId { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Puntos { get; set; }
        public int? TipoTransferenciaId { get; set; }

        public TipoTransferencia TipoTransferencia { get; set; }
        public Usuario Usuario { get; set; }
        public Usuario UsuarioDestinoUsuario { get; set; }
        public Usuario UsuarioFuenteUsuario { get; set; }
    }
}
