import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from '@angular/common';
import {Status} from "../error-alert/error-alert.component";
import {FamilyService} from "../service/family.service";
import {StudentService} from "../service/student.service";
import {GuardianService} from "../service/guardian.service";
import { ObjectID } from 'bson';

@Component({
  selector: 'app-enroll-family',
  templateUrl: './enroll-family.component.html',
  styleUrls: ['./enroll-family.component.css']
})
export class EnrollFamilyComponent implements OnInit {

  enrollFamilyStatus: Status;
  familyID: string;
  familyName: string;
  students: string[] = [];
  guardians: string[] = [];

  enrollStudentStatus: Status;
  studentID: string;
  studentFname: string;
  studentLname: string;
  studentMi: string;
  studentBirthDate: Date;
  studentNotes: string;

  enrollGuardianStatus: Status;
  guardianID: string;
  guardianFname: string;
  guardianLname: string;
  guardianMi: string;
  guardianRelationship: string;
  guardianPrimPhone: string;
  guardianSecPhone: string;
  guardianEmail: string;

  constructor(private familyService: FamilyService, private studentService: StudentService,
              private guardianService: GuardianService, private router: Router, private location: Location) {
    this.enrollFamilyStatus = {
      success: null,
      message: null
    };
    this.enrollStudentStatus = {
      success: null,
      message: null
    };
    this.enrollGuardianStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
  }

  createStudent(familyID: ObjectID) {
    this.studentID = ObjectID();
    this.studentService.createStudent(this.studentID, this.studentFname, this.studentLname, this.studentMi, this.studentBirthDate,
      this.studentNotes, familyID).then(() => {
      this.students.push(this.studentID);
      this.enrollStudentStatus.success = true;
      // this.location.back();
      this.createGuardian(familyID);
    }).catch(err => {
      console.log(err);
      this.enrollStudentStatus.success = false;
      this.enrollStudentStatus.message = 'An error occurred while enrolling the student ' + this.studentFname + ' ' + this.studentLname;
    })
  }

  createGuardian(familyID: ObjectID) {
    this.guardianID = ObjectID();
    this.guardianService.createGuardian(this.guardianID, this.guardianFname, this.guardianLname, this.guardianMi,
      this.guardianRelationship, this.guardianPrimPhone, this.guardianSecPhone, this.guardianEmail, familyID).then(() => {
      this.guardians.push(this.guardianID);
      this.enrollGuardianStatus.success = true;
      // this.location.back();
      this.createFamily(familyID);
    }).catch(err => {
      console.log(err);
      this.enrollGuardianStatus.success = false;
      this.enrollGuardianStatus.message = 'An error occurred while enrolling the guardian ' + this.guardianFname + ' ' + this.guardianLname;
    })
  }

  createFamily(familyID: ObjectID) {
    this.familyService.createFamily(familyID, this.familyName, this.students, this.guardians).then(() => {
      this.enrollFamilyStatus.success = true;
      this.location.back();
    }).catch(err => {
      console.log(err);
      this.enrollFamilyStatus.success = false;
      this.enrollFamilyStatus.message = 'An error occurred while enrolling the ' + this.familyName + ' family';
    })
  }

  enrollFamily() {
    this.familyID = ObjectID();
    this.createStudent(this.familyID);
    // this.createGuardian(this.familyID);
    // this.createFamily(this.familyID);
  }

  cancel() {
    this.location.back();
  }
}
