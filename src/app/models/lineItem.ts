export class LineItem {
  _id: string;
  familyID: string;
  studentID: string;
  extraItem: boolean;
  checkIn: Date;
  checkOut: Date;
  serviceType: string;
  earlyInLateOutFee: number;
  lineTotalCost: number;
  checkInBy: string;
  checkOutBy: string;
  notes: string;
  invoiceID: string;
}
