using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class FormasDePagoViewModel
    {
        public int value { get; set; }
        public string label { get; set; }

        public FormasDePagoViewModel(int pvalue, string plabel)
        {
            this.value = pvalue;
            this.label = plabel;
        }
    }
}
