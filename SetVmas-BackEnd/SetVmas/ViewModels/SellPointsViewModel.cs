using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class SellPointsViewModel
    {
        public int Seller { get; set; }
        public string Buyer { get; set; }
        public int Amount { get; set; }
        public int TipoTransferencia { get; set; }
    }
}
