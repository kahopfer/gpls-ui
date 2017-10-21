import {Component, OnDestroy, OnInit} from '@angular/core';
import {Student} from "../../models/student";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';
import {NgForm} from "@angular/forms";
import {StudentService} from "../../service/student.service";
import {Status} from "../error-alert/error-alert.component";
import {isNullOrUndefined} from "util";
import {GuardianService} from "../../service/guardian.service";
import {AuthenticationService} from "../../service/authentication.service";
import {LineItemService} from "../../service/lineItem.service";
import 'rxjs/add/operator/toPromise';

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

  guardiansStatus: Status;
  studentsStatus: Status;

  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
              private studentService: StudentService, private guardianService: GuardianService,
              private authService: AuthenticationService, private lineItemService: LineItemService) {
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
        if (JSON.parse(students[studentIndex]._body).checkedIn === true) {
          // Just in case someone reloads the page with the student just checked in still in the query params
          console.log("Already checked in");
          continue;
        }
        this.students.push(JSON.parse(students[studentIndex]._body))
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
        this.guardianArray.push(JSON.parse(guardians[guardianIndex]._body).guardians);
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

  updateStudentCheckedInStatus(form: NgForm) {
    let updateStudentPromiseArray: Promise<any>[] = [];
    let createLineItemPromiseArray: Promise<any>[] = [];

    for (let studentIndex in this.students) {
      this.students[studentIndex].checkedIn = true;
      updateStudentPromiseArray.push(this.studentService.updateCheckedIn(this.students[studentIndex]));
    }

    for (let studentIndex in this.students) {
      createLineItemPromiseArray.push(this.lineItemService.createLineItem(this.students[studentIndex].familyUnitID,
        this.students[studentIndex]._id, new Date(), null, null, null, null,
        form.value['checkInBy-' + studentIndex], null, null, null).toPromise());
    }

    Promise.all(createLineItemPromiseArray).then(() => {
      Promise.all(updateStudentPromiseArray).then(() => {
        this.studentsStatus.success = true;
        this.router.navigate(['/check-in']);
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.studentsStatus.success = false;
          this.studentsStatus.message = 'An unexpected error occurred';
        } else {
          if (err.status === 400) {
            this.studentsStatus.success = false;
            this.studentsStatus.message = 'Missing a required field in the students';
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
        if (err.status === 400) {
          this.studentsStatus.success = false;
          this.studentsStatus.message = 'Missing a required field in the line items';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.studentsStatus.success = false;
          this.studentsStatus.message = 'An error occurred while creating the line items';
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
