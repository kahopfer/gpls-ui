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
import {OrderPipe} from "ngx-order-pipe";
import {Message} from "primeng/primeng";

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
  msgs: Message[] = [];

  constructor(private lineItemService: LineItemService, private familyService: FamilyService,
              private studentService: StudentService, private guardianService: GuardianService,
              private orderPipe: OrderPipe) {
  }

  ngOnInit() {
  }

  downloadInvoice(id: string) {
    const doc = new jsPDF({});
    let pageHeight: number = doc.internal.pageSize.height;
    const schoolName: string = 'Green Park Lutheran School';
    const addressLine1: string = '4248 Green Park Road';
    const addressLine2: string = 'St. Louis, MO 63125';
    const phoneNumber: string = '(314) 544-4248';
    const website: string = 'www.greenparklutheranschool.org';
    const federalTaxID: string = 'Federal Tax ID#43-0781056';

    this.familyService.getFamily(this.selectedInvoice.familyID).then(family => {
      this.family = family['data'];
      let getGuardiansPromiseArray: Promise<any>[] = [];
      if (this.family.active) {
        getGuardiansPromiseArray.push(this.guardianService.getGuardians(this.family._id));
      } else {
        getGuardiansPromiseArray.push(this.guardianService.getInactiveGuardians(this.family._id));
      }
      Promise.all(getGuardiansPromiseArray).then(guardians => {
        this.lineItemService.getLineItemsByInvoiceID(id).then(lineItems => {
          this.lineItems = lineItems['data']['lineItems'];
          this.orderPipe.transform(this.lineItems, 'checkIn');
          let individualStudentPromiseArray: Promise<any>[] = [];
          for (let lineItemIndex in this.lineItems) {
            individualStudentPromiseArray.push(this.studentService.getStudent(this.lineItems[lineItemIndex].studentID));
          }
          Promise.all(individualStudentPromiseArray).then(students => {
            this.lineItemsToDisplay = this.lineItems;
            for (let studentIndex in students) {
              this.lineItemsToDisplay[studentIndex].studentName = students[studentIndex]['data']['fname'] + ' ' +
                students[studentIndex]['data']['lname'];
            }
            for (let guardianIndex in guardians) {
              this.guardians = guardians[guardianIndex]['data']['guardians'];
            }
            let invoiceDate: string = new Date(this.selectedInvoice.invoiceDate).toLocaleDateString();
            let invoiceFromDate: string = new Date(this.selectedInvoice.invoiceFromDate).toLocaleDateString();
            let invoiceToDate: string = new Date(this.selectedInvoice.invoiceToDate).toLocaleDateString();

            let startingHeight: number = 100;
            let currentHeight: number = startingHeight;
            let lineItemCount: number = 1;
            let pageNumber: number = 1;

            doc.setFontSize(10);

            for (let lineItemIndex in this.lineItems) {

              if (currentHeight >= (pageHeight - 60)) {
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
                doc.setFontType('bold');
                doc.text('Statement', 154, 19);

                doc.setFontType('normal');
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
                doc.text(invoiceFromDate + ' - ' + invoiceToDate, 96, 40);

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


                doc.rect(10, 95, 25, 18);
                doc.text('Date', 13, 105);

                doc.rect(35, 95, 35, 18);
                doc.text('Student', 38, 105);

                doc.rect(70, 95, 30, 18);
                doc.text('Service Type', 73, 105);

                doc.rect(100, 95, 50, 18);
                let splitSignInSignOutHeader = doc.splitTextToSize('Sign In/Sign Out Times', 45);
                doc.text(splitSignInSignOutHeader, 103, 105);

                doc.rect(150, 95, 25, 18);
                let splitEarlyInLateOutFeeHeader = doc.splitTextToSize('Early Drop\n-off/Late Arrival', 20);
                doc.text(splitEarlyInLateOutFeeHeader, 153, 101);

                doc.rect(175, 95, 25, 18);
                doc.text('Amount', 178, 105);

                let lineItemRectHeight: number = pageHeight - 135;

                doc.rect(10, 113, 25, lineItemRectHeight);
                doc.rect(35, 113, 35, lineItemRectHeight);
                doc.rect(70, 113, 30, lineItemRectHeight);
                doc.rect(100, 113, 50, lineItemRectHeight);
                doc.rect(150, 113, 25, lineItemRectHeight);
                doc.rect(175, 113, 25, lineItemRectHeight);

                doc.text(100, 285, 'Page ' + pageNumber);
              }

              currentHeight = startingHeight + (20 * lineItemCount);

              let lineItemDate: string = new Date(this.lineItems[lineItemIndex].checkIn).toLocaleDateString();
              let splitLineItemDate = doc.splitTextToSize(lineItemDate, 20);
              doc.text(splitLineItemDate, 13, currentHeight);

              let splitStudentName = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].studentName, 30);
              doc.text(splitStudentName, 38, currentHeight);

              let splitServiceType = doc.splitTextToSize(this.lineItemsToDisplay[lineItemIndex].serviceType, 25);
              doc.text(splitServiceType, 73, currentHeight);

              let splitSignInAndOutTime = doc.splitTextToSize('In at ' + new Date(this.lineItemsToDisplay[lineItemIndex].checkIn).toLocaleTimeString() +
                '\nby ' + this.lineItemsToDisplay[lineItemIndex].checkInBy + '\nOut at ' + new Date(this.lineItemsToDisplay[lineItemIndex].checkOut).toLocaleTimeString() +
                '\nby ' + this.lineItemsToDisplay[lineItemIndex].checkOutBy, 45);
              doc.text(splitSignInAndOutTime, 103, currentHeight);

              let earlyInLateOutFee: string = numeral(this.lineItemsToDisplay[lineItemIndex].earlyInLateOutFee).format('($0.00)');
              let splitEarlyInLateOutFee = doc.splitTextToSize(earlyInLateOutFee, 20);
              doc.text(splitEarlyInLateOutFee, 153, currentHeight);

              let lineTotalCost: string = numeral(this.lineItemsToDisplay[lineItemIndex].lineTotalCost).format('($0.00)');
              let splitLineTotalCost = doc.splitTextToSize(lineTotalCost, 20);
              doc.text(splitLineTotalCost, 178, currentHeight);

              lineItemCount = lineItemCount + 1;
            }

            doc.save(this.family.familyName + '_' + invoiceDate + '.pdf');

          }).catch(err => {
            if (err.error instanceof Error) {
              console.log('An error occurred:', err.error.message);
              this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
            } else {
              console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
              try {
                this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
              } catch (e) {
                if (err.status === 401) {
                  this.msgs.push({
                    severity: 'error',
                    summary: 'Error Message',
                    detail: 'Unauthorized. Please try logging out and logging back in again.'
                  });
                } else {
                  this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
                }
              }
            }
          });
        }).catch(err => {
          if (err.error instanceof Error) {
            console.log('An error occurred:', err.error.message);
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            try {
              this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
            } catch (e) {
              if (err.status === 401) {
                this.msgs.push({
                  severity: 'error',
                  summary: 'Error Message',
                  detail: 'Unauthorized. Please try logging out and logging back in again.'
                });
              } else {
                this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
              }
            }
          }
        });
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          try {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
          } catch (e) {
            if (err.status === 401) {
              this.msgs.push({
                severity: 'error',
                summary: 'Error Message',
                detail: 'Unauthorized. Please try logging out and logging back in again.'
              });
            } else {
              this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
            }
          }
        }
      })
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        try {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
        } catch (e) {
          if (err.status === 401) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Unauthorized. Please try logging out and logging back in again.'
            });
          } else {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
          }
        }
      }
    })
  }
}
