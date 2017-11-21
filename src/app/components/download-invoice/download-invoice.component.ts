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

@Component({
  selector: 'app-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.css']
})
export class DownloadInvoiceComponent implements OnInit {
  //TODO: Maybe add students and guardians as input variables
  @Input() selectedInvoice: Invoice;
  lineItems: LineItem[] = [];
  lineItemsToDisplay: any[] = [];
  guardians: Guardian[] = [];

  constructor(private lineItemService: LineItemService, private familyService: FamilyService,
              private studentService: StudentService, private guardianService: GuardianService) {
  }

  ngOnInit() {
  }

  // TODO: Include student names for each line item, guardian names on top, and wrap to new page
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
      this.guardianService.getGuardians(this.selectedInvoice.familyID).then(guardians => {
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
            doc.setFontSize(10);
            doc.text(schoolName, 10, 10);
            doc.text(addressLine1, 10, 15);
            doc.text(addressLine2, 10, 20);
            doc.text(phoneNumber, 10, 25);
            doc.text(website, 10, 30);
            doc.text(federalTaxID, 10, 35);

            doc.setFontSize(25);
            doc.text('Statement', 160, 14);

            doc.setFontSize(10);

            doc.text('Date', 175, 25);
            doc.text(invoiceDate, 170, 30);

            doc.text('To:', 10, 45);
            let toText: string = '';
            for (let guardianIndex in this.guardians) {
              if (+guardianIndex === this.guardians.length - 1) {
                toText = toText.concat(this.guardians[guardianIndex].fname + ' ' + this.guardians[guardianIndex].lname + ' (' + this.guardians[guardianIndex].email + ')')
              } else {
                toText = toText.concat(this.guardians[guardianIndex].fname + ' ' + this.guardians[guardianIndex].lname + ' (' + this.guardians[guardianIndex].email + ') & ')
              }
            }
            let splitToText = doc.splitTextToSize(toText, 125);
            doc.text(splitToText, 10, 50);

            doc.text('Amount Due:', 170, 45);
            let totalCost: string = numeral(this.selectedInvoice.totalCost).format('($0.00)');
            doc.text(totalCost, 175, 50);


            doc.text('Student', 10, 80);
            doc.text('Sign In Time', 35, 80);
            doc.text('Sign Out Time', 78, 80);
            doc.text('Service Type', 120, 80);
            // doc.text('Signed Out By', 120, 80);
            let splitEarlyInLateOutFeeHeader = doc.splitTextToSize('Early Drop-off/Late Arrival', 25);
            doc.text(splitEarlyInLateOutFeeHeader, 155, 80);
            doc.text('Amount', 185, 80);

            let startingHeight: number = 95;
            let currentHeight: number = startingHeight;

            let lineItemCount: number = 0;
            for (let lineItemIndex in this.lineItems) {
              if (currentHeight >= (pageHeight - 30)) {
                doc.addPage();
                currentHeight = 0;
                startingHeight = 0;
                lineItemCount = 1;
              }

              currentHeight = startingHeight + (20 * lineItemCount);

              let splitStudentName = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].studentName, 20);
              doc.text(splitStudentName, 10, currentHeight);

              let splitCheckInTime = doc.splitTextToSize(new Date(this.lineItemsToDisplay[lineItemIndex].checkIn).toLocaleString() +
                ' by ' + this.lineItemsToDisplay[lineItemIndex].checkInBy, 40);
              doc.text(splitCheckInTime, 35, currentHeight);

              let splitCheckOutTime = doc.splitTextToSize(new Date(this.lineItemsToDisplay[lineItemIndex].checkOut).toLocaleString() +
                ' by ' + this.lineItemsToDisplay[lineItemIndex].checkOutBy, 40);
              doc.text(splitCheckOutTime, 78, currentHeight);

              let splitServiceType = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].serviceType, 30);
              doc.text(splitServiceType, 120, currentHeight);

              // let splitCheckOutBy = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].checkOutBy, 20);
              // doc.text(splitCheckOutBy, 120, currentHeight);

              let earlyInLateOutFee: string = numeral(this.lineItemsToDisplay[lineItemIndex].earlyInLateOutFee).format('($0.00)');
              let splitEarlyInLateOutFee = doc.splitTextToSize(earlyInLateOutFee, 30);
              doc.text(splitEarlyInLateOutFee, 155, currentHeight);

              let lineTotalCost: string = numeral(this.lineItemsToDisplay[lineItemIndex].lineTotalCost).format('($0.00)');
              let splitLineTotalCost = doc.splitTextToSize(lineTotalCost, 20);
              doc.text(splitLineTotalCost, 185, currentHeight);

              lineItemCount = lineItemCount + 1;
            }

            doc.save(family['familyName'] + '_' + invoiceDate + '.pdf');

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
