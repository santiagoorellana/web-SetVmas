using System;
using System.Collections.Generic;

namespace SetVmasDomain.Models
{
    public partial class VariableConfiguracion
    {
        public int VariableConfiguracionId { get; set; }
        public string Nombre { get; set; }
        public string NombreCodigo { get; set; }
        public string Valor { get; set; }
        public string Tipo { get; set; }
    }
}
