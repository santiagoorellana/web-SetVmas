using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class PurchaseFormViewModel
    {
        public string FormaPago { get; set; }
        public string Monto { get; set; }
        public string NoTarjeta { get; set; }
        public string Phone { get; set; }
        public int UserId { get; set; }
        public int TipoTransferencia { get; set; } //Para saber que tipo de transferencia se hizo 1- Compra Directa 2-Venta entre Usuarios
    }
}
