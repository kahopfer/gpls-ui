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
  //TODO: Maybe add students and guardians as input variables
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
      let getGuardiansPromiseArray: Promise<Guardian>[] = [];

      for (let guardianIndex in this.family.guardians) {
        getGuardiansPromiseArray.push(this.guardianService.getGuardian(this.family.guardians[guardianIndex]));
      }

      Promise.all(getGuardiansPromiseArray).then(guardians => {
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

            this.guardians = guardians;
            let invoiceDate: string = new Date(this.selectedInvoice.invoiceDate).toLocaleDateString();

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

                doc.text(schoolName, 15, 15);
                doc.text(addressLine1, 15, 20);
                doc.text(addressLine2, 15, 25);
                doc.text(phoneNumber, 15, 30);
                doc.text(website, 15, 35);
                doc.text(federalTaxID, 15, 40);

                doc.setFontSize(25);
                doc.text('Statement', 155, 19);

                doc.setFontSize(10);

                doc.rect(160, 28, 30, 7);
                doc.rect(160, 35, 30, 8);

                doc.text('Date', 170, 33);
                doc.text(invoiceDate, 165, 40);

                // Rectangles around guardians
                doc.rect(10, 50, 133, 7);
                doc.rect(10, 57, 133, 25);

                doc.text('To:', 15, 55);
                let toText: string = '';
                for (let guardianIndex in this.guardians) {
                  if (+guardianIndex === this.guardians.length - 1) {
                    toText = toText.concat(this.guardians[guardianIndex].fname + ' ' + this.guardians[guardianIndex].lname + ' (' + this.guardians[guardianIndex].email + ')')
                  } else {
                    toText = toText.concat(this.guardians[guardianIndex].fname + ' ' + this.guardians[guardianIndex].lname + ' (' + this.guardians[guardianIndex].email + ') & ')
                  }
                }
                let splitToText = doc.splitTextToSize(toText, 125);
                doc.text(splitToText, 15, 62);

                // Rectangles around amount
                doc.rect(160, 50, 30, 7);
                doc.rect(160, 57, 30, 8);

                doc.text('Amount Due:', 165, 55);
                let totalCost: string = numeral(this.selectedInvoice.totalCost).format('($0.00)');
                doc.text(totalCost, 169, 62);


                doc.rect(10, 95, 25, 18);
                doc.text('Student', 15, 105);

                doc.rect(35, 95, 30, 18);
                doc.text('Sign In Time', 40, 105);

                doc.rect(65, 95, 33, 18);
                doc.text('Sign Out Time', 70, 105);

                doc.rect(98, 95, 37, 18);
                doc.text('Service Type', 103, 105);

                doc.rect(135, 95, 30, 18);
                let splitEarlyInLateOutFeeHeader = doc.splitTextToSize('Early Drop-off/Late Arrival', 25);
                doc.text(splitEarlyInLateOutFeeHeader, 140, 101);

                doc.rect(165, 95, 35, 18);
                doc.text('Amount', 170, 105);

                let lineItemRectHeight: number = pageHeight - 135;

                doc.rect(10, 113, 25, lineItemRectHeight);
                doc.rect(35, 113, 30, lineItemRectHeight);
                doc.rect(65, 113, 33, lineItemRectHeight);
                doc.rect(98, 113, 37, lineItemRectHeight);
                doc.rect(135, 113, 30, lineItemRectHeight);
                doc.rect(165, 113, 35, lineItemRectHeight);

                doc.text(100, 285, 'Page ' + pageNumber);
              }

              currentHeight = startingHeight + (20 * lineItemCount);

              let splitStudentName = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].studentName, 20);
              doc.text(splitStudentName, 15, currentHeight);

              let splitCheckInTime = doc.splitTextToSize(new Date(this.lineItemsToDisplay[lineItemIndex].checkIn).toLocaleString() +
                ' by ' + this.lineItemsToDisplay[lineItemIndex].checkInBy, 30);
              doc.text(splitCheckInTime, 40, currentHeight);

              let splitCheckOutTime = doc.splitTextToSize(new Date(this.lineItemsToDisplay[lineItemIndex].checkOut).toLocaleString() +
                ' by ' + this.lineItemsToDisplay[lineItemIndex].checkOutBy, 30);
              doc.text(splitCheckOutTime, 70, currentHeight);

              let splitServiceType = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].serviceType, 30);
              doc.text(splitServiceType, 103, currentHeight);

              // let splitCheckOutBy = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].checkOutBy, 20);
              // doc.text(splitCheckOutBy, 120, currentHeight);

              let earlyInLateOutFee: string = numeral(this.lineItemsToDisplay[lineItemIndex].earlyInLateOutFee).format('($0.00)');
              let splitEarlyInLateOutFee = doc.splitTextToSize(earlyInLateOutFee, 30);
              doc.text(splitEarlyInLateOutFee, 140, currentHeight);

              let lineTotalCost: string = numeral(this.lineItemsToDisplay[lineItemIndex].lineTotalCost).format('($0.00)');
              let splitLineTotalCost = doc.splitTextToSize(lineTotalCost, 20);
              doc.text(splitLineTotalCost, 170, currentHeight);

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
