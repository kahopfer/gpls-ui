import {Component, OnDestroy, OnInit} from '@angular/core';
import {Student} from "../../models/student";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';
import {NgForm} from "@angular/forms";
import {StudentService} from "../../service/student.service";
import {isNullOrUndefined} from "util";
import {GuardianService} from "../../service/guardian.service";
import {AuthenticationService} from "../../service/authentication.service";
import {LineItemService} from "../../service/lineItem.service";
import 'rxjs/add/operator/toPromise';
import {LineItem} from "../../models/lineItem";
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-check-in-details',
  templateUrl: './check-in-details.component.html',
  styleUrls: ['./check-in-details.component.css']
})
export class CheckInDetailsComponent implements OnInit, OnDestroy {
  private studentIdSub: any;
  studentIdArray: string[] = [];

  private fullNameSub: any;
  fullName: string;

  students: Student[] = [];
  guardianArray: any[] = [];

  allCheckedInByEmployee: boolean;

  msgs: Message[] = [];

  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
              private studentService: StudentService, private guardianService: GuardianService,
              private authService: AuthenticationService, private lineItemService: LineItemService) {
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
        }

        if (typeof params['id'] === 'string') {
          this.studentIdArray = params['id'].split(',');
          this.getStudents();
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
        if (students[studentIndex]['data']['checkedIn'] === true) {
          // Just in case someone reloads the page with the student just checked in still in the query params
          console.log("Already checked in");
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

  updateStudentCheckedInStatus(form: NgForm) {
    let createLineItemPromiseArray: Promise<any>[] = [];

    for (let studentIndex in this.students) {
      let date: Date = new Date();
      let lineItemToCreate: LineItem = {
        _id: null,
        familyID: this.students[studentIndex].familyUnitID,
        studentID: this.students[studentIndex]._id,
        extraItem: false,
        checkIn: date,
        checkOut: null,
        serviceType: 'Child Care',
        earlyInLateOutFee: 0.00,
        lineTotalCost: 0.00,
        checkInBy: null,
        checkOutBy: null,
        notes: null,
        invoiceID: null
      };

      if (this.allCheckedInByEmployee) {
        lineItemToCreate.checkInBy = this.fullName;
      } else {
        lineItemToCreate.checkInBy = form.value['checkInBy-' + studentIndex];
      }
      createLineItemPromiseArray.push(this.lineItemService.createLineItem(lineItemToCreate).toPromise());
    }

    Promise.all(createLineItemPromiseArray).then(() => {
      this.router.navigate(['/sign-in']);
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
      this.students = [];
      this.getStudents();
    });
  }

  private changeFullName(name: string): void {
    this.fullName = name;
  }

  cancel() {
    this.location.back();
  }
}
