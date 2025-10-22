
export class Transfer {
    constructor(
      public TransferId: number,
      public SourceUser: String,
      public TargetUser: String,
      public OperationDate: Date,
      public Points: number,
      public TransferType: String
      ) {}
  
  }
  