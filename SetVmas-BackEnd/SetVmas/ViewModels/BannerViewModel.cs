using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class BannerViewModel
    {
      /*  public BannerViewModel()
        {

            Denuncias = new List<DenunciaViewModel>();
        }*/
        public int BannerId { get; set; }
        public string Nombre { get; set; }
        public string Url { get; set; }
        public string Tipo { get; set; }
        public int CantidadDias { get; set; }
        public int AnuncioId { get; set; }
      public bool IsActivo { get; set; }
          public string ImageContent { get; set; }
          public string ImageMimeType { get; set; }
          public string ImageName { get; set; }
          public DateTime FechaCreacion { get; set; }
          public DateTime? FechaUltView { get; set; }
         public DateTime? FechaDesactivacion { get; set; }

        public AnuncioViewModel Anuncio { get; set; }
        // public List<DenunciaViewModel> Denuncias { get; set; }
    }
}
