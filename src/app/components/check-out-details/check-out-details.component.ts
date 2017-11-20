import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';
import {Student} from "../../models/student";
import {NgForm} from "@angular/forms";
import {Status} from "../error-alert/error-alert.component";
import {StudentService} from "../../service/student.service";
import {GuardianService} from "../../service/guardian.service";
import {AuthenticationService} from "../../service/authentication.service";
import {isNullOrUndefined} from "util";
import {LineItemService} from "../../service/lineItem.service";
import {LineItem} from "../../models/lineItem";
import {PriceListService} from "../../service/priceList.service";
import {PriceList} from "../../models/priceList";
import 'rxjs/add/operator/toPromise';

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

  guardiansStatus: Status;
  studentsStatus: Status;

  allCheckedOutByEmployee: boolean;

  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
              private studentService: StudentService, private guardianService: GuardianService,
              private authService: AuthenticationService, private lineItemService: LineItemService,
              private priceListService: PriceListService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.fullName = currentUser && currentUser.firstname + ' ' + currentUser.lastname;

    this.studentsStatus = {
      success: null,
      message: null
    };

    this.guardiansStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
    this.studentIdSub = this.route.queryParams.subscribe(params => {
      // TODO: Maybe figure out better way to do this
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
        if (students[studentIndex]['checkedIn'] === false) {
          // Just in case someone reloads the page with the student just checked out still in the query params
          console.log("Already checked out");
          continue;
        }
        this.students.push(students[studentIndex])
      }
      this.studentsStatus.success = true;
      this.getGuardians();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.studentsStatus.success = false;
        this.studentsStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.studentsStatus.success = false;
        this.studentsStatus.message = 'An error occurred while loading the students';
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
        this.guardianArray.push(guardians[guardianIndex]['guardians']);
      }
      this.guardiansStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.guardiansStatus.success = false;
        this.guardiansStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.guardiansStatus.success = false;
        this.guardiansStatus.message = 'An error occurred while loading the guardians';
      }
    })
  }

  getExtraItems(): void {
    this.priceListService.getExtraPriceList().then(priceList => {
      this.extraItems = priceList['priceLists'];
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    });
  }

  updateStudentCheckedInStatus(form: NgForm) {
    // This promise array will be used to update the checked in status of each student
    let updateStudentPromiseArray: Promise<any>[] = [];

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
        let temporaryLineItem: LineItem = lineItems[lineItemIndex]['lineItems'][0];
        // Set temp line item values
        temporaryLineItem.checkOut = new Date();
        // temporaryLineItem.serviceType = LineItemService.determineServiceType(new Date(temporaryLineItem.checkIn), temporaryLineItem.checkOut);
        temporaryLineItem.serviceType = 'Child Care';
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
          this.students[studentIndex].checkedIn = false;
          updateStudentPromiseArray.push(this.studentService.updateCheckedIn(this.students[studentIndex]));
        }

        // Then update each student's checked in status
        Promise.all(updateStudentPromiseArray).then(() => {

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
            this.studentsStatus.success = true;
            this.router.navigate(['/sign-out']);
          }).catch(err => {
            if (err.error instanceof Error) {
              console.log('An error occurred:', err.error.message);
              this.studentsStatus.success = false;
              this.studentsStatus.message = 'An unexpected error occurred';
            } else {
              if (err.status === 400) {
                this.studentsStatus.success = false;
                this.studentsStatus.message = 'Missing a required field';
              } else {
                console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                this.studentsStatus.success = false;
                this.studentsStatus.message = 'An error occurred while creating the extra line items';
              }
            }
          });
        }).catch(err => {
          if (err.error instanceof Error) {
            console.log('An error occurred:', err.error.message);
            this.studentsStatus.success = false;
            this.studentsStatus.message = 'An unexpected error occurred';
          } else {
            if (err.status === 400) {
              this.studentsStatus.success = false;
              this.studentsStatus.message = 'Missing a required field';
            } else {
              console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
              this.studentsStatus.success = false;
              this.studentsStatus.message = 'An error occurred while updating the students';
            }
          }
        });
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.studentsStatus.success = false;
          this.studentsStatus.message = 'An unexpected error occurred';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.studentsStatus.success = false;
          this.studentsStatus.message = 'An error occurred while updating the line items';
        }
      })
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.studentsStatus.success = false;
        this.studentsStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.studentsStatus.success = false;
        this.studentsStatus.message = 'An error occurred while retrieving the line items';
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
