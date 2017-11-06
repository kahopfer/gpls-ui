export class Invoice {
  _id: string;
  familyID: string;
  lineItemsID: string[];
  totalCost: number;
  paid: boolean;
  invoiceFromDate: Date;
  invoiceToDate: Date;
  invoiceDate: Date;
}
