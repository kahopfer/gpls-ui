import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Status} from "../error-alert/error-alert.component";
import {FamilyService} from "../../service/family.service";
import {StudentService} from "../../service/student.service";
import {GuardianService} from "../../service/guardian.service";
import {ObjectID} from 'bson';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-enroll-family',
  templateUrl: './enroll-family.component.html',
  styleUrls: ['./enroll-family.component.css']
})
export class EnrollFamilyComponent implements OnInit {

  public enrollFamilyForm: FormGroup;

  enrollFamilyStatus: Status;
  enrollStudentStatus: Status;
  enrollGuardianStatus: Status;

  mask: any[] = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(private familyService: FamilyService, private studentService: StudentService,
              private guardianService: GuardianService, private location: Location,
              private formBuilder: FormBuilder) {
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
    this.enrollFamilyForm = this.formBuilder.group({
      familyName: ['', Validators.required],
      students: this.formBuilder.array([
        this.initStudent()
      ]),
      guardians: this.formBuilder.array([
        this.initGuardian()
      ])
    })
  }

  initStudent() {
    return this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      mi: ['', Validators.maxLength(1)],
      // birthDate: ['', Validators.required],
      notes: ['']
    })
  }

  initGuardian() {
    return this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      mi: ['', Validators.maxLength(1)],
      relationship: ['', Validators.required],
      primPhone: ['', [Validators.required, Validators.pattern("\\+\\d \\(\\d{3}\\) \\d{3}-\\d{4}")]],
      secPhone: ['', [Validators.pattern("\\+\\d \\(\\d{3}\\) \\d{3}-\\d{4}")]],
      email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)]]
    })
  }

  getStudents(enrollFamilyForm) {
    return enrollFamilyForm.get('students').controls
  }

  getGuardians(enrollFamilyForm) {
    return enrollFamilyForm.get('guardians').controls
  }

  addStudent() {
    const control = <FormArray>this.enrollFamilyForm.controls['students'];
    control.push(this.initStudent());
  }

  removeStudent(i: number) {
    const control = <FormArray>this.enrollFamilyForm.controls['students'];
    control.removeAt(i);
  }

  addGuardian() {
    const control = <FormArray>this.enrollFamilyForm.controls['guardians'];
    control.push(this.initGuardian());
  }

  removeGuardian(i: number) {
    const control = <FormArray>this.enrollFamilyForm.controls['guardians'];
    control.removeAt(i);
  }

  enrollFamily(model: FormGroup) {
    let familyID = ObjectID();

    let createStudentPromise = new Promise((resolve, reject) => {
      let students: string[] = [];
      for (let studentIndex in model.value.students) {
        let studentID = ObjectID();
        students.push(studentID);
        this.studentService.createStudent(studentID, model.value.students[studentIndex].fname,
          model.value.students[studentIndex].lname, model.value.students[studentIndex].mi, model.value.students[studentIndex].notes,
          false, familyID).subscribe(() => {
          this.enrollStudentStatus.success = true;
        }, err => {
          reject(err);
          return;
        });
      }
      resolve(students);
    });

    let createGuardiansPromise = new Promise((resolve, reject) => {
      let guardians: string[] = [];
      for (let guardianIndex in model.value.guardians) {
        let guardianID = ObjectID();
        guardians.push(guardianID);
        this.guardianService.createGuardian(guardianID, model.value.guardians[guardianIndex].fname,
          model.value.guardians[guardianIndex].lname, model.value.guardians[guardianIndex].mi,
          model.value.guardians[guardianIndex].relationship, model.value.guardians[guardianIndex].primPhone,
          model.value.guardians[guardianIndex].secPhone, model.value.guardians[guardianIndex].email,
          familyID).subscribe(() => {
          this.enrollGuardianStatus.success = true;
        }, err => {
          reject(err);
          return;
        });
      }
      resolve(guardians);
    });

    createStudentPromise.then((students: string[]) => {
      createGuardiansPromise.then((guardians: string[]) => {
        this.familyService.createFamily(familyID, model.value.familyName, students, guardians).subscribe(() => {
          this.enrollFamilyStatus.success = true;
          this.location.back();
        }, err => {
          console.log(err);
          this.enrollFamilyStatus.success = false;
          this.enrollFamilyStatus.message = 'An error occurred while enrolling the ' + model.value.familyName + ' family';
        });
      }).catch(err => {
        console.log(err);
        this.enrollGuardianStatus.success = false;
        this.enrollGuardianStatus.message = 'An error occurred while enrolling the guardian';
      });
    }).catch((err) => {
      console.log(err);
      this.enrollStudentStatus.success = false;
      this.enrollStudentStatus.message = 'An error occurred while enrolling the student';
    })
  }

  cancel() {
    this.location.back();
  }
}
