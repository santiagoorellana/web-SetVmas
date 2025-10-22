using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class AnuncioViewModel
    {
        public AnuncioViewModel()
        {
            Etiquetas = new List<EtiquetaViewModel>();
            OpcionesAvanzadas = new List<OpcionesAvanzadasViewModel>();
            Banners = new List<BannerViewModel>();
            Categoria = new CategoriaViewModel();
            Usuario = new UsuarioViewModel();
            AlmacenImagen = new List<AlmacenImagenViewModel>();
        }
        public int AnuncioId { get; set; }
        public string Titulo { get; set; }
        public string Accion { get; set; }
        public string Descripcion { get; set; }
        public string NombreContacto { get; set; }
        public string TelefonoContacto { get; set; }
        public string CorreoContacto { get; set; }
        public decimal Precio { get; set; }
        public bool IsVisible { get; set; }
        public bool IsActivo { get; set; }
        public string Provincia { get; set; }
        public string Municipio { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }    
        public string ImageName { get; set; }
        public string ImageContent { get; set; }
        public string ImageMimeType { get; set; }
        public string Url { get; set; }
        public bool IsDestacado { get; set; }
        public bool IsWeb { get; set; }
        public string Tipo { get; set; }
        public string Captcha { get; set; }
        public bool ProductoNuevo { get; set; }
        public int ContadorView { get; set; }
        public int Rotacion { get; set; } // para saber si hay q rotar la imagen
        public UsuarioViewModel Usuario { get; set; }
        public List<AlmacenImagenViewModel> AlmacenImagen { get; set; }
        public List<EtiquetaViewModel> Etiquetas { get; set; }
        public CategoriaViewModel Categoria { get; set; }
        public List<OpcionesAvanzadasViewModel> OpcionesAvanzadas { get; set; }
        public List<BannerViewModel> Banners { get; set; }



        ///para mostrar total de bsqueda en pantalla
        public int totalbuscado { set; get; }
    }
}
