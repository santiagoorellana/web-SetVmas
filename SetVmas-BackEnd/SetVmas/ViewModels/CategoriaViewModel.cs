using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class CategoriaViewModel
    {
        public CategoriaViewModel()
        {
            Etiquetas = new List<EtiquetaViewModel>();

        }
        public int CategoriaId { get; set; }
        public string Nombre { get; set; }
        public string ImageName { get; set; }
        public string ImageContent { get; set; }
        public string ImageMimeType { get; set; }
 
        public int CantAutoRenovables { get; set; }

        public List<EtiquetaViewModel> Etiquetas { get; set; }
    }
}
