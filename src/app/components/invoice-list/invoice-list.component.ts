import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  invoices: any[];
  selectedInvoice: any;
  paidOptions: any[];

  constructor() {
  }

  ngOnInit() {
    this.invoices = [{
      familyName: "Smith",
      lineItemsID: [
        "59bec3b9274b8f7ccabf19e1"
      ],
      totalCost: 31.00,
      paid: true,
      invoiceFromDate: new Date("September 4, 2017 00:00:00"),
      invoiceToDate: new Date("September 8, 2017 00:00:00")
    }, {
      familyName: "Jones",
      lineItemsID: [
        "59bec3b9274b8f7ccabf19e1"
      ],
      totalCost: 16.00,
      paid: false,
      invoiceFromDate: new Date("August 14, 2017 00:00:00"),
      invoiceToDate: new Date("August 18, 2017 00:00:00")
    }, {
      familyName: "Seashell",
      lineItemsID: [
        "59bec3b9274b8f7ccabf19e1"
      ],
      totalCost: 20.00,
      paid: false,
      invoiceFromDate: new Date("September 18, 2017 00:00:00"),
      invoiceToDate: new Date("September 22, 2017 00:00:00")
    }, {
      familyName: "Redmond",
      lineItemsID: [
        "59bec3b9274b8f7ccabf19e1"
      ],
      totalCost: 10.75,
      paid: true,
      invoiceFromDate: new Date("November 6, 2017 00:00:00"),
      invoiceToDate: new Date("November 10, 2017 00:00:00")
    }, {
      familyName: "Winston",
      lineItemsID: [
        "59bec3b9274b8f7ccabf19e1"
      ],
      totalCost: 3.90,
      paid: true,
      invoiceFromDate: new Date("October 16, 2017 00:00:00"),
      invoiceToDate: new Date("October 20, 2017 00:00:00")
    }];

    this.paidOptions = [{
      label: "All",
      value: null
    }, {
      label: "True",
      value: "true"
    }, {
      label: "False",
      value: "false"
    }];
  }

}
