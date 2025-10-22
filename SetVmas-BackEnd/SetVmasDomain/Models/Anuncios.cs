using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace SetVmasDomain.Models
{
    public partial class Anuncios
    {
        public Anuncios()
        {
            AlmacenImagen = new HashSet<AlmacenImagen>();
            AnuncioEtiquetas = new HashSet<AnuncioEtiquetas>();
            Banners = new HashSet<Banners>();
            Denuncias = new HashSet<Denuncias>();
            Notificacion = new HashSet<Notificacion>();
            OpcionAvanzadas = new HashSet<OpcionAvanzadas>();
        }

        public int AnuncioId { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string NombreContacto { get; set; }
        public string TelefonoContacto { get; set; }
        public string CorreoContacto { get; set; }
        public decimal Precio { get; set; }
        public bool IsActivo { get; set; }
        public bool IsVisible { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public string ImageContent { get; set; }
        public string ImageMimeType { get; set; }
        public string ImageName { get; set; }
        public string Url { get; set; }
        public string Provincia { get; set; }
        public string Municipio { get; set; }
        public int ContadorView { get; set; }
        public bool ProductoNuevo { get; set; }
        public string Accion { get; set; }
        public int? UsuarioId { get; set; }

        public Usuario Usuario { get; set; }
        public ICollection<AlmacenImagen> AlmacenImagen { get; set; }
        public ICollection<AnuncioEtiquetas> AnuncioEtiquetas { get; set; }
        public ICollection<Banners> Banners { get; set; }
        public ICollection<Denuncias> Denuncias { get; set; }
        public ICollection<Notificacion> Notificacion { get; set; }
        public ICollection<OpcionAvanzadas> OpcionAvanzadas { get; set; }


        ///para mostrar total de bsqueda en pantalla
        [NotMapped]
        public int totalbuscado { set; get; }

    }
}
