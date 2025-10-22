using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class EtiquetaViewModel
    {
        public EtiquetaViewModel()
        {
            Categorias = new List<CategoriaViewModel>();
        }
        public int EtiquetaId { get; set; }
        public string Nombre { get; set; }
        public int CantUsada { get; set; }
        public bool IsFree { get; set; }
        public List<CategoriaViewModel> Categorias { get; set; }
    }
}
