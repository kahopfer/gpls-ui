import {ExtraItem} from "./extraItem";

export class LineItem {
  _id: string;
  familyID: string;
  studentID: string;
  checkIn: Date;
  checkOut: Date;
  extraItems: ExtraItem[];
  earlyInLateOutFee: number;
  lineTotalCost: number;
  checkInBy: string;
  checkOutBy: string;
  notes: string;
  invoiceID: string;
}
