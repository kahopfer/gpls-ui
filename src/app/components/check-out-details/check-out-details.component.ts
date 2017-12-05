import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';
import {Student} from "../../models/student";
import {NgForm} from "@angular/forms";
import {StudentService} from "../../service/student.service";
import {GuardianService} from "../../service/guardian.service";
import {AuthenticationService} from "../../service/authentication.service";
import {isNullOrUndefined} from "util";
import {LineItemService} from "../../service/lineItem.service";
import {LineItem} from "../../models/lineItem";
import {PriceListService} from "../../service/priceList.service";
import {PriceList} from "../../models/priceList";
import 'rxjs/add/operator/toPromise';
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-check-out-details',
  templateUrl: './check-out-details.component.html',
  styleUrls: ['./check-out-details.component.css']
})
export class CheckOutDetailsComponent implements OnInit, OnDestroy {
  private studentIdSub: any;
  studentIdArray: string[] = [];

  extraItems: PriceList[] = [];

  private fullNameSub: any;
  fullName: string;

  students: Student[] = [];
  guardianArray: any[] = [];

  allCheckedOutByEmployee: boolean;

  msgs: Message[] = [];

  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
              private studentService: StudentService, private guardianService: GuardianService,
              private authService: AuthenticationService, private lineItemService: LineItemService,
              private priceListService: PriceListService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.fullName = currentUser && currentUser.firstname + ' ' + currentUser.lastname;
  }

  ngOnInit() {
    this.studentIdSub = this.route.queryParams.subscribe(params => {
      // For some reason, when the page is initially loaded, the query params are stored as an array...
      // ...however, when it is reloaded, they are stored as a string
      if (!isNullOrUndefined(params['id'])) {
        if (typeof params['id'] === 'object') {
          let studentIdString = params['id'][0];
          this.studentIdArray = studentIdString.split(',');
          this.getStudents();
          this.getExtraItems();
        }

        if (typeof params['id'] === 'string') {
          this.studentIdArray = params['id'].split(',');
          this.getStudents();
          this.getExtraItems();
        }
      }
    });

    this.fullNameSub = this.authService.getLoggedInName.subscribe(name => this.changeFullName(name));
  }

  ngOnDestroy() {
    this.studentIdSub.unsubscribe();
    this.fullNameSub.unsubscribe();
  }

  getStudents() {
    let promiseArray: Promise<any>[] = [];

    for (let studentIndex in this.studentIdArray) {
      promiseArray.push(this.studentService.getStudent(this.studentIdArray[studentIndex]));
    }

    Promise.all(promiseArray).then(students => {
      for (let studentIndex in students) {
        if (students[studentIndex]['data']['checkedIn'] === false) {
          // Just in case someone reloads the page with the student just checked out still in the query params
          console.log("Already checked out");
          continue;
        }
        this.students.push(students[studentIndex]['data'])
      }
      this.getGuardians();
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

  getGuardians() {
    let promiseArray: Promise<any>[] = [];

    for (let studentIndex in this.students) {
      promiseArray.push(this.guardianService.getGuardians(this.students[studentIndex].familyUnitID));
    }

    Promise.all(promiseArray).then(guardians => {
      for (let guardianIndex in guardians) {
        this.guardianArray.push(guardians[guardianIndex]['data']['guardians']);
      }
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

  getExtraItems(): void {
    this.priceListService.getExtraPriceList().then(priceList => {
      this.extraItems = priceList['data']['priceLists'];
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
  }

  updateStudentCheckedInStatus(form: NgForm) {

    // This promise array will be used to get a list of all line items without a check out time
    let getLineItemPromiseArray: Promise<any>[] = [];

    // This promise array will be used to update the existing line item for each student
    let updateLineItemPromiseArray: Promise<any>[] = [];

    // This promise array will be used to create line items for any extra items that the student may have had
    let createLineItemExtraPromiseArray: Promise<any>[] = [];


    for (let studentIndex in this.students) {
      getLineItemPromiseArray.push(this.lineItemService.getLineItemsWithoutCheckOut(this.students[studentIndex]._id));
    }

    // First get all of the line items without a check out time
    Promise.all(getLineItemPromiseArray).then(lineItems => {
      // Go through all the line items returned
      for (let lineItemIndex in lineItems) {
        // Temporary line item used to stage the changes
        let temporaryLineItem: LineItem = lineItems[lineItemIndex]['data']['lineItems'][0];
        // Set temp line item values
        temporaryLineItem.checkOut = new Date();
        // Note: line items should be in the same order as the students, so the lineItemIndex will match the studentIndex
        if (this.allCheckedOutByEmployee) {
          temporaryLineItem.checkOutBy = this.fullName;
        } else {
          temporaryLineItem.checkOutBy = form.value['checkOutBy-' + lineItemIndex];
        }
        temporaryLineItem.notes = form.value['lineItemNotes-' + lineItemIndex];
        // Next, push the edited line item to the update line item promise array
        updateLineItemPromiseArray.push(this.lineItemService.updateLineItem(temporaryLineItem));
      }
      // Update the line items
      Promise.all(updateLineItemPromiseArray).then(() => {

        for (let studentIndex in this.students) {
          // Go through extra items
          for (let extraItemIndex in this.extraItems) {
            // If an extra item was checked...
            if (form.value['extraItem-' + studentIndex + '-' + extraItemIndex]) {
              let date: Date = new Date();
              // ...then add it to the promise array
              let lineItemToCreate: LineItem = {
                _id: null,
                familyID: this.students[studentIndex].familyUnitID,
                studentID: this.students[studentIndex]._id,
                extraItem: true,
                checkIn: date,
                checkOut: date,
                serviceType: this.extraItems[extraItemIndex].itemName,
                earlyInLateOutFee: 0.00,
                lineTotalCost: 0.00,
                checkInBy: 'Other',
                checkOutBy: 'Other',
                notes: null,
                invoiceID: null
              };
              createLineItemExtraPromiseArray.push(this.lineItemService.createLineItem(lineItemToCreate).toPromise());
            }
          }
        }

        Promise.all(createLineItemExtraPromiseArray).then(() => {
          this.router.navigate(['/sign-out']);
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
    });
  }

  private changeFullName(name: string): void {
    this.fullName = name;
  }

  cancel() {
    this.location.back();
  }
}
