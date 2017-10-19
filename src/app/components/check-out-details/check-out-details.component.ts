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

@Component({
  selector: 'app-check-out-details',
  templateUrl: './check-out-details.component.html',
  styleUrls: ['./check-out-details.component.css']
})
export class CheckOutDetailsComponent implements OnInit, OnDestroy {
  private studentIdSub: any;
  studentIdArray: any[] = [];

  private fullNameSub: any;
  fullName: string;

  students: Student[] = [];
  guardianArray: any[] = [];

  guardiansStatus: Status;
  studentsStatus: Status;

  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
              private studentService: StudentService, private guardianService: GuardianService,
              private authService: AuthenticationService) {
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
        if (JSON.parse(students[studentIndex]._body).checkedIn === false) {
          // Just in case someone reloads the page with the student just checked out still in the query params
          console.log("Already checked out");
          continue;
        }
        this.students.push(JSON.parse(students[studentIndex]._body))
      }
      this.studentsStatus.success = true;
      this.getGuardians();
    }).catch(err => {
      console.log(err);
      this.studentsStatus.success = false;
      this.studentsStatus.message = 'An error occurred while loading the students';
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
      console.log(err);
      this.guardiansStatus.success = false;
      this.guardiansStatus.message = 'An error occurred while loading the guardians';
    })
  }

  updateStudentCheckedInStatus(form: NgForm) {
    let promiseArray: Promise<any>[] = [];

    for (let studentIndex in this.students) {
      this.students[studentIndex].checkedIn = false;
      promiseArray.push(this.studentService.updateCheckedIn(this.students[studentIndex]));
    }

    Promise.all(promiseArray).then(() => {
      this.studentsStatus.success = false;
      console.log(form.value);
      // This is where the line items would be created
      this.router.navigate(['/check-out']);
    }).catch(err => {
      if (err.status === 400) {
        this.studentsStatus.success = false;
        this.studentsStatus.message = 'Missing a required field';
      } else {
        console.log(err);
        this.studentsStatus.success = false;
        this.studentsStatus.message = 'An error occurred while updating the student';
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
