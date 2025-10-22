using SetVmasDomain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class DenunciaViewModel
    {
        public int DenunciaId { get; set; }
        public string Estado { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int MotivoDenunciaId { get; set; }
        public int AnuncioId { get; set; }
        public int UsuarioId { get; set; }
        public string MotivoDenuncia { get; set; }
        public string Titulo { get; set; }
        public string Correo { get; set; }
        public string Codigo { get; set; }
        public int AnuncioUsuarioId { get; set; }
        public int UsuarioClasificaId { get; set; }

        /* public string Anuncio { get; set; }
         public string MotivoDenuncia { get; set; }
         public string Usuario { get; set; }*/
    }
}
