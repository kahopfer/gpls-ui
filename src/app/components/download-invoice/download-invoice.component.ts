import {Component, Input, OnInit} from '@angular/core';
import {Invoice} from "../../models/invoice";
import {LineItemService} from "../../service/lineItem.service";
import * as jsPDF from 'jspdf';
import {LineItem} from "../../models/lineItem";
import {FamilyService} from "../../service/family.service";

@Component({
  selector: 'app-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.css']
})
export class DownloadInvoiceComponent implements OnInit {
  @Input() selectedInvoice: Invoice;
  lineItems: LineItem[] = [];

  constructor(private lineItemService: LineItemService, private familyService: FamilyService) { }

  ngOnInit() {
  }

  // TODO: Include student names for each line item, guardian names on top, and wrap to new page
  downloadInvoice(id: string) {
    const doc = new jsPDF({
      orientation: 'landscape'
    });
    let pageHeight: number = doc.internal.pageSize.height;
    const schoolName: string = 'Green Park Lutheran School';
    const addressLine1: string = '4248 Green Park Road';
    const addressLine2: string = 'St. Louis, MO 63125';
    const phoneNumber: string = '(314) 544-4248';
    const website: string = 'www.greenparklutheranschool.org';
    const federalTaxID: string = 'Federal Tax ID#43-0781056';

    this.familyService.getFamily(this.selectedInvoice.familyID).then(family => {
      this.lineItemService.getLineItemsByInvoiceID(id).then(lineItems => {
        this.lineItems = lineItems['lineItems'];
        let invoiceDate: string = new Date(this.selectedInvoice.invoiceDate).toLocaleDateString();

        doc.setFontSize(10);
        doc.text(schoolName, 10, 10);
        doc.text(addressLine1, 10, 15);
        doc.text(addressLine2, 10, 20);
        doc.text(phoneNumber, 10, 25);
        doc.text(website, 10, 30);
        doc.text(federalTaxID, 10, 35);
        doc.text('Check In', 10, 60);
        doc.text('Check Out', 60, 60);
        doc.text('Service Type', 105, 60);
        doc.text('Dropped Off By', 155, 60);
        doc.text('Picked Up By', 185, 60);
        doc.text('Early Drop-off/Late Arrival', 215, 60);
        doc.text('Amount', 260, 60);


        for (let lineItemIndex in this.lineItems) {
          let index: number = 65 + (10 * +lineItemIndex);

          doc.text(new Date(this.lineItems[lineItemIndex].checkIn).toLocaleString(), 10, index);
          doc.text(new Date(this.lineItems[lineItemIndex].checkOut).toLocaleString(), 60, index);
          let splitServiceType = doc.splitTextToSize(this.lineItems[lineItemIndex].serviceType, 40);
          doc.text(splitServiceType, 105, index);
          doc.text(this.lineItems[lineItemIndex].checkInBy, 155, index);
          doc.text(this.lineItems[lineItemIndex].checkOutBy, 185, index);
          doc.text(this.lineItems[lineItemIndex].earlyInLateOutFee.toLocaleString(), 215, index);
          doc.text(this.lineItems[lineItemIndex].lineTotalCost.toLocaleString(), 260, index)
        }

        // let index = 90 + (10 * this.lineItems.length);
        // doc.text('Total Cost: ' + this.selectedInvoice.totalCost, 10, 70);

        doc.save(family['familyName'] + '_' + invoiceDate + '.pdf');




      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
        } else {
          console.log(err);
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    })
  }
}
