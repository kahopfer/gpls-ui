import {Component, Input, OnInit} from '@angular/core';
import {Invoice} from "../../models/invoice";
import {LineItemService} from "../../service/lineItem.service";
import * as jsPDF from 'jspdf';
import {LineItem} from "../../models/lineItem";
import {FamilyService} from "../../service/family.service";
import {StudentService} from "../../service/student.service";
import {GuardianService} from "../../service/guardian.service";
import {Guardian} from "../../models/guardian";
import * as numeral from 'numeral';
import {Family} from "../../models/family";

@Component({
  selector: 'app-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.css']
})
export class DownloadInvoiceComponent implements OnInit {
  @Input() selectedInvoice: Invoice;
  lineItems: LineItem[] = [];
  lineItemsToDisplay: any[] = [];
  guardians: Guardian[] = [];
  family: Family;

  constructor(private lineItemService: LineItemService, private familyService: FamilyService,
              private studentService: StudentService, private guardianService: GuardianService) {
  }

  ngOnInit() {
  }

  downloadInvoice(id: string) {
    const doc = new jsPDF({
      // orientation: 'landscape'
    });
    let pageHeight: number = doc.internal.pageSize.height;
    const schoolName: string = 'Green Park Lutheran School';
    const addressLine1: string = '4248 Green Park Road';
    const addressLine2: string = 'St. Louis, MO 63125';
    const phoneNumber: string = '(314) 544-4248';
    const website: string = 'www.greenparklutheranschool.org';
    const federalTaxID: string = 'Federal Tax ID#43-0781056';

    this.familyService.getFamily(this.selectedInvoice.familyID).then(family => {
      this.family = family;
      //TODO: Decide whether invoices should pull all guardians or only active ones
      // let getGuardiansPromiseArray: Promise<Guardian>[] = [];
      //
      // for (let guardianIndex in this.family.guardians) {
      //   getGuardiansPromiseArray.push(this.guardianService.getGuardian(this.family.guardians[guardianIndex]));
      // }

      this.guardianService.getGuardians(this.family._id).then(guardians => {
        this.lineItemService.getLineItemsByInvoiceID(id).then(lineItems => {
          this.lineItems = lineItems['lineItems'];
          let individualStudentPromiseArray: Promise<any>[] = [];
          for (let lineItemIndex in this.lineItems) {
            individualStudentPromiseArray.push(this.studentService.getStudent(this.lineItems[lineItemIndex].studentID));
          }
          Promise.all(individualStudentPromiseArray).then(students => {
            this.lineItemsToDisplay = this.lineItems;
            for (let studentIndex in students) {
              this.lineItemsToDisplay[studentIndex].studentName = students[studentIndex]['fname'] + ' ' +
                students[studentIndex]['lname'];
            }

            this.guardians = guardians['guardians'];
            let invoiceDate: string = new Date(this.selectedInvoice.invoiceDate).toLocaleDateString();
            let invoiceFromDate: string = new Date(this.selectedInvoice.invoiceFromDate).toLocaleDateString();
            let invoiceToDate: string = new Date(this.selectedInvoice.invoiceToDate).toLocaleDateString();

            let startingHeight: number = 100;
            let currentHeight: number = startingHeight;
            let lineItemCount: number = 1;
            let pageNumber: number = 1;

            doc.setFontSize(10);

            // TODO: Make columns more even
            for (let lineItemIndex in this.lineItems) {

              if (currentHeight >= (pageHeight - 40)) {
                doc.addPage();
                currentHeight = 0;
                startingHeight = 100;
                lineItemCount = 1;
                pageNumber = pageNumber + 1;
              }

              if (lineItemCount === 1) {
                // Rectangle around school info
                doc.rect(10, 10, 65, 33);

                doc.text(schoolName, 13, 15);
                doc.text(addressLine1, 13, 20);
                doc.text(addressLine2, 13, 25);
                doc.text(phoneNumber, 13, 30);
                doc.text(website, 13, 35);
                doc.text(federalTaxID, 13, 40);

                doc.setFontSize(25);
                doc.text('Statement', 155, 19);

                doc.setFontSize(10);

                // Rectangle around date
                doc.rect(160, 28, 30, 7);
                doc.rect(160, 35, 30, 8);

                doc.text('Date', 171, 33);
                doc.text(invoiceDate, 166, 40);

                // Rectangle around invoice range
                doc.rect(85, 28, 60, 7);
                doc.rect(85, 35, 60, 8);

                doc.text('Range', 110, 33);
                doc.text(invoiceFromDate + ' - ' + invoiceToDate, 98, 40);

                // Rectangles around guardians
                doc.rect(10, 50, 135, 7);
                doc.rect(10, 57, 135, 25);

                doc.text('To:', 13, 55);
                let toText: string = '';
                for (let guardianIndex in this.guardians) {
                  if (+guardianIndex === this.guardians.length - 1) {
                    toText = toText.concat(this.guardians[guardianIndex].fname + ' ' + this.guardians[guardianIndex].lname + ' (' + this.guardians[guardianIndex].email + ')')
                  } else {
                    toText = toText.concat(this.guardians[guardianIndex].fname + ' ' + this.guardians[guardianIndex].lname + ' (' + this.guardians[guardianIndex].email + ') & ')
                  }
                }
                let splitToText = doc.splitTextToSize(toText, 125);
                doc.text(splitToText, 13, 62);

                // Rectangles around amount
                doc.rect(160, 50, 30, 7);
                doc.rect(160, 57, 30, 8);

                doc.text('Amount Due', 166, 55);
                let totalCost: string = numeral(this.selectedInvoice.totalCost).format('($0.00)');
                doc.text(totalCost, 169, 62);


                doc.rect(10, 95, 35, 18);
                doc.text('Student', 13, 105);

                doc.rect(45, 95, 35, 18);
                doc.text('Sign In Time', 48, 105);

                doc.rect(80, 95, 35, 18);
                doc.text('Sign Out Time', 83, 105);

                doc.rect(115, 95, 30, 18);
                doc.text('Service Type', 118, 105);

                doc.rect(145, 95, 30, 18);
                let splitEarlyInLateOutFeeHeader = doc.splitTextToSize('Early Drop-off/Late Arrival', 25);
                doc.text(splitEarlyInLateOutFeeHeader, 148, 101);

                doc.rect(175, 95, 25, 18);
                doc.text('Amount', 178, 105);

                let lineItemRectHeight: number = pageHeight - 135;

                doc.rect(10, 113, 35, lineItemRectHeight);
                doc.rect(45, 113, 35, lineItemRectHeight);
                doc.rect(80, 113, 35, lineItemRectHeight);
                doc.rect(115, 113, 30, lineItemRectHeight);
                doc.rect(145, 113, 30, lineItemRectHeight);
                doc.rect(175, 113, 25, lineItemRectHeight);

                doc.text(100, 285, 'Page ' + pageNumber);
              }

              currentHeight = startingHeight + (20 * lineItemCount);

              let splitStudentName = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].studentName, 30);
              doc.text(splitStudentName, 13, currentHeight);

              let splitCheckInTime = doc.splitTextToSize(new Date(this.lineItemsToDisplay[lineItemIndex].checkIn).toLocaleString() +
                ' by ' + this.lineItemsToDisplay[lineItemIndex].checkInBy, 30);
              doc.text(splitCheckInTime, 48, currentHeight);

              let splitCheckOutTime = doc.splitTextToSize(new Date(this.lineItemsToDisplay[lineItemIndex].checkOut).toLocaleString() +
                ' by ' + this.lineItemsToDisplay[lineItemIndex].checkOutBy, 30);
              doc.text(splitCheckOutTime, 83, currentHeight);

              let splitServiceType = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].serviceType, 25);
              doc.text(splitServiceType, 118, currentHeight);

              let earlyInLateOutFee: string = numeral(this.lineItemsToDisplay[lineItemIndex].earlyInLateOutFee).format('($0.00)');
              let splitEarlyInLateOutFee = doc.splitTextToSize(earlyInLateOutFee, 25);
              doc.text(splitEarlyInLateOutFee, 148, currentHeight);

              let lineTotalCost: string = numeral(this.lineItemsToDisplay[lineItemIndex].lineTotalCost).format('($0.00)');
              let splitLineTotalCost = doc.splitTextToSize(lineTotalCost, 20);
              doc.text(splitLineTotalCost, 178, currentHeight);

              lineItemCount = lineItemCount + 1;
            }

            doc.save(this.family.familyName + '_' + invoiceDate + '.pdf');

          }).catch(err => {
            if (err.error instanceof Error) {
              console.log('An error occurred:', err.error.message);
            } else {
              console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            }
          });
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
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    })
  }
}
