import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {Family} from "../../models/family";
import {Student} from "../../models/student";
import {Guardian} from "../../models/guardian";
import {FamilyService} from "../../service/family.service";
import {StudentService} from "../../service/student.service";
import {GuardianService} from "../../service/guardian.service";
import {ObjectID} from 'bson';
import {ConfirmationService, Message} from "primeng/primeng";

@Component({
  selector: 'app-inactive-family-details',
  templateUrl: './inactive-family-details.component.html',
  styleUrls: ['./inactive-family-details.component.css']
})
export class InactiveFamilyDetailsComponent implements OnInit {

  family: Family = new Family;
  students: Student[] = [];
  guardians: Guardian[] = [];

  selectedStudent: Student;
  selectedGuardian: Guardian;

  // Used to determine whether to create or update a student/guardian
  newStudent: boolean;
  newGuardian: boolean;

  // Student/guardian that is displayed in the dialog
  student: Student = new Student();
  guardian: Guardian = new Guardian();

  // Used to show/hide the student/guardian dialog
  displayStudentDialog: boolean;
  displayGuardianDialog: boolean;

  mask: any[] = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  msgs: Message[] = [];

  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;

  constructor(private familyService: FamilyService, private studentService: StudentService,
              private guardianService: GuardianService, private route: ActivatedRoute, private location: Location,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.getFamily(this.route.snapshot.params['id']);
    this.getStudents(this.route.snapshot.params['id']);
    this.getGuardians(this.route.snapshot.params['id']);
  }

  getStudents(familyUnitID: string) {
    this.studentsLoading = true;
    this.studentService.getInactiveStudents(familyUnitID).then(students => {
      this.students = students['students'];
      this.studentsLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the students'
        });
      }
      this.studentsLoading = false;
    });
  }

  getGuardians(familyUnitID: string) {
    this.guardiansLoading = true;
    this.guardianService.getInactiveGuardians(familyUnitID).then(guardians => {
      this.guardians = guardians['guardians'];
      this.guardiansLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the guardians'
        });
      }
      this.guardiansLoading = false;
    });
  }

  getFamily(id: string) {
    this.familyService.getFamily(id).then(family => {
      this.family = family;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An occurred while loading the family'});
      }
    })
  }

  confirmDeleteFamily() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this family? This will also delete all invoices and line items associated with this family.',
      header: 'Delete Family Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteFamily();
      }
    })
  }

  deleteFamily() {
    this.familyService.deleteFamily(this.route.snapshot.params['id']).then(() => {
      this.location.back();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        if (err.status === 400) {
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'You cannot delete a family with either uninvoiced line items or unpaid invoices'
          });
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while deleting the family'
          });
        }
      }
    });
  }

  confirmReactivateFamily() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reactivate this family?',
      header: 'Reactivate Family Confirmation',
      icon: 'fa fa-check',
      accept: () => {
        this.reactivateFamily();
      }
    })
  }

  reactivateFamily() {
    this.family.active = true;
    this.familyService.updateActiveFamily(this.family).then(() => {
      this.location.back();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while reactivating the family'
        });
      }
      this.family.active = false;
    });
  }

  onStudentSelect(event) {
    this.newStudent = false;
    this.studentService.getStudent(event.data._id).then(student => {
      this.student = student;
      this.displayStudentDialog = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the student'
        });
      }
    });
    this.displayStudentDialog = true;
  }

  onGuardianSelect(event) {
    this.newGuardian = false;
    this.guardianService.getGuardian(event.data._id).then(guardian => {
      this.guardian = guardian;
      this.displayGuardianDialog = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the guardian'
        });
      }
    });
    this.displayGuardianDialog = true;
  }
}
