using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class PurchaseDirectViewModel
    {
        public string MinPointsBankTransfer { get; set; }
        public string MinPointsPhoneTransfer { get; set; }
        public string MinPointsDirectContact { get; set; }
        public string PointPrice { get; set; }
        public string StateFPBankTransfer { get; set; }
        public string StateFPPhoneTransfer { get; set; }
        public string NoCard { get; set; }
        public string NoPhone { get; set; }
        public List<FormasDePagoViewModel> FormasDePago { get; set; }
    }


}
