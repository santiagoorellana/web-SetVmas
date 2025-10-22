using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SetVmas.ViewModels
{
    public class TransfersViewModel
    {
        public int TransferId { get; set; }
        public DateTime OperationDate { get; set; }
        public string TransferType { get; set; }
        public string User { get; set; }
        public string SourceUser { get; set; }
        public string TargetUser { get; set; }
        public decimal Points { get; set; }
        public string NombreCodigo { get; set; }
        

        public TransfersViewModel()
        {

        }
        public TransfersViewModel(int pTransferId, DateTime pOperationDate, string pTransferType, string pSourceUser, string pTargetUser, decimal pPoints, string NombreCodigo)
        {
            this.TransferId = pTransferId;
            this.OperationDate = pOperationDate;
            this.TransferType = pTransferType;
            this.SourceUser = pSourceUser;
            this.TargetUser = pTargetUser;
            this.Points = pPoints;
            this.NombreCodigo = NombreCodigo;
        }

    }
}
