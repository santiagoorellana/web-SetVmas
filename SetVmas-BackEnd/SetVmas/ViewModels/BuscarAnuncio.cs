using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class BuscarAnuncio
    {
        public int AnuncioId { get; set; }
        public string Categoria { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string NombreContacto { get; set; }
        public string TelefonoContacto { get; set; }
        public string CorreoContacto { get; set; }
        public string Accion { get; set; }
        public string Municipio { get; set; }
        public string Provincia { get; set; }
        public string Url { get; set; }
        public decimal PrecioMin { get; set; }
        public decimal PrecioMax { get; set; }
        public bool IsWeb { get; set; }
        public bool HasFoto { get; set; }
        public bool ProductoNuevo { get; set; }
        public List<EtiquetaViewModel> ListaEtiquetas { get; set; }
        public string EtiquetasConcat { get; set; }
        public int indexPage { get; set; }
        public int sizePage { get; set; }
    }
}
