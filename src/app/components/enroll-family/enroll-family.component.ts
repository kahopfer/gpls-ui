import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FamilyService} from "../../service/family.service";
import {StudentService} from "../../service/student.service";
import {GuardianService} from "../../service/guardian.service";
import {ObjectID} from 'bson';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Guardian} from "../../models/guardian";
import {Family} from "../../models/family";
import {Student} from "../../models/student";
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-enroll-family',
  templateUrl: './enroll-family.component.html',
  styleUrls: ['./enroll-family.component.css']
})
export class EnrollFamilyComponent implements OnInit {

  public enrollFamilyForm: FormGroup;

  msgs: Message[] = [];

  mask: any[] = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(private familyService: FamilyService, private studentService: StudentService,
              private guardianService: GuardianService, private location: Location,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.enrollFamilyForm = this.formBuilder.group({
      familyName: ['', [Validators.required, Validators.pattern(/[A-Za-z'-]+/), Validators.maxLength(35)]],
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
      fname: ['', [Validators.required, Validators.pattern(/[A-Za-z'-]+/), Validators.maxLength(35)]],
      lname: ['', [Validators.required, Validators.pattern(/[A-Za-z'-]+/), Validators.maxLength(35)]],
      mi: ['', [Validators.maxLength(1), Validators.pattern(/[A-Za-z]/)]],
      notes: ['', Validators.maxLength(140)]
    })
  }

  initGuardian() {
    return this.formBuilder.group({
      fname: ['', [Validators.required, Validators.pattern(/[A-Za-z'-]+/), Validators.maxLength(35)]],
      lname: ['', [Validators.required, Validators.pattern(/[A-Za-z'-]+/), Validators.maxLength(35)]],
      mi: ['', [Validators.maxLength(1), Validators.pattern(/[A-Za-z]/)]],
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
        let studentToCreate: Student = {
          _id: studentID,
          fname: model.value.students[studentIndex].fname,
          lname: model.value.students[studentIndex].lname,
          mi: model.value.students[studentIndex].mi,
          notes: model.value.students[studentIndex].notes,
          checkedIn: false,
          familyUnitID: familyID,
          active: true
        };

        this.studentService.enrollStudent(studentToCreate).subscribe(() => {
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
        let guardianToCreate: Guardian = {
          _id: guardianID,
          fname: model.value.guardians[guardianIndex].fname,
          lname: model.value.guardians[guardianIndex].lname,
          mi: model.value.guardians[guardianIndex].mi,
          relationship: model.value.guardians[guardianIndex].relationship,
          primPhone: model.value.guardians[guardianIndex].primPhone,
          secPhone: model.value.guardians[guardianIndex].secPhone,
          email: model.value.guardians[guardianIndex].email,
          familyUnitID: familyID,
          active: true
        };
        this.guardianService.enrollGuardian(guardianToCreate).subscribe(() => {
        }, err => {
          reject(err);
          return;
        });
      }
      resolve(guardians);
    });

    createStudentPromise.then((students: string[]) => {
      createGuardiansPromise.then((guardians: string[]) => {
        let familyToCreate: Family = {
          _id: familyID,
          familyName: model.value.familyName,
          students: students,
          guardians: guardians,
          active: true
        };

        this.familyService.createFamily(familyToCreate).subscribe(() => {
          this.location.back();
        }, err => {
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
    }).catch((err) => {
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

  cancel() {
    this.location.back();
  }
}
