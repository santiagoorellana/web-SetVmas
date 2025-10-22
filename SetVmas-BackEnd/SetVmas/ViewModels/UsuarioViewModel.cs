using SetVmasDomain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class UsuarioViewModel
    {
        public int UsuarioId { get; set; }
        public string Correo { get; set; }
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
        public bool? Visible { get; set; }
        public string Clase { get; set; }
        public string Password { get; set; }
        public ClasesUsuarios ClasesUsuarios { get; set; }
        public string Codigo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaUltimaEntrada { get; set; }
        public DateTime? FechaUltimoAnuncio { get; set; }
        public DateTime? FechaDesbloqueo { get; set; }

    }
}
