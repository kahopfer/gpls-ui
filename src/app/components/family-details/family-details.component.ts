import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {Status} from "../error-alert/error-alert.component";
import {Family} from "../../models/family";
import {Student} from "../../models/student";
import {Guardian} from "../../models/guardian";
import {FamilyService} from "../../service/family.service";
import {StudentService} from "../../service/student.service";
import {GuardianService} from "../../service/guardian.service";
import {ObjectID} from 'bson';
import {AuthenticationService} from "../../service/authentication.service";
import {ConfirmationService} from "primeng/primeng";

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.css']
})

export class FamilyDetailsComponent implements OnInit, OnDestroy {
  private adminSub: any;
  admin: boolean;

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

  editableFamily: Family = new Family();
  displayFamilyForm: boolean = false;

  mask: any[] = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  studentStatus: Status;
  studentsStatus: Status;
  guardianStatus: Status;
  guardiansStatus: Status;
  familyStatus: Status;

  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;

  constructor(private familyService: FamilyService, private studentService: StudentService,
              private guardianService: GuardianService, private route: ActivatedRoute, private location: Location,
              private authService: AuthenticationService, private confirmationService: ConfirmationService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.admin = currentUser && currentUser.admin;

    this.studentStatus = {
      success: null,
      message: null
    };

    this.studentsStatus = {
      success: null,
      message: null
    };

    this.guardianStatus = {
      success: null,
      message: null
    };

    this.guardiansStatus = {
      success: null,
      message: null
    };

    this.familyStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit(): void {
    this.adminSub = this.authService.getAdmin.subscribe(admin => this.changeAdmin(admin));
    this.getFamily(this.route.snapshot.params['id']);
    this.getStudents(this.route.snapshot.params['id']);
    this.getGuardians(this.route.snapshot.params['id']);
  }

  ngOnDestroy() {
    this.adminSub.unsubscribe();
  }

  private changeAdmin(admin: boolean): void {
    this.admin = admin;
  }

  getStudents(familyUnitID: string) {
    this.studentsLoading = true;
    this.studentService.getStudents(familyUnitID).then(students => {
      this.students = students['students'];
      this.studentsStatus.success = true;
      this.studentsLoading = false;
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
      this.studentsLoading = false;
    });
  }

  getGuardians(familyUnitID: string) {
    this.guardiansLoading = true;
    this.guardianService.getGuardians(familyUnitID).then(guardians => {
      this.guardians = guardians['guardians'];
      this.guardiansStatus.success = true;
      this.guardiansLoading = false;
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
      this.guardiansLoading = false;
    });
  }

  getFamily(id: string) {
    this.familyService.getFamily(id).then(family => {
      this.family = family;
      this.familyStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.familyStatus.success = false;
        this.familyStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.familyStatus.success = false;
        this.familyStatus.message = 'An occurred while loading the family';
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
      this.familyStatus.success = true;
      this.location.back();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.familyStatus.success = false;
        this.familyStatus.message = 'An unexpected error occurred';
      } else {
        if (err.status === 400) {
          this.familyStatus.success = false;
          this.familyStatus.message = 'You cannot delete a family with either uninvoiced line items or unpaid invoices'
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.familyStatus.success = false;
          this.familyStatus.message = 'An error occurred while deleting the family';
        }
      }
    });
  }

  deleteStudent(id: string) {
    if (this.family.students.length === 1) {
      this.studentStatus.success = false;
      this.studentStatus.message = 'A family must have at least 1 child';
      return;
    }
    this.studentService.deleteStudent(id).then(() => {
      this.studentStatus.success = true;
      this.student = null;
      this.displayStudentDialog = false;
      this.getStudents(this.route.snapshot.params['id']);
      this.getFamily(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.studentStatus.success = false;
        this.studentStatus.message = 'An unexpected error occurred';
      } else {
        if (err.status === 404) {
          this.studentStatus.success = false;
          this.studentStatus.message = 'Student not found';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.studentStatus.success = false;
          this.studentStatus.message = 'An error occurred while deleting the student';
        }
      }
    })
  }

  confirmDeleteStudent(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this student?',
      header: 'Delete Student Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteStudent(id);
      }
    })
  }

  deleteGuardian(id: string) {
    if (this.family.guardians.length === 1) {
      this.guardianStatus.success = false;
      this.guardianStatus.message = 'A family must have at least 1 guardian';
      return;
    }
    this.guardianService.deleteGuardian(id).then(() => {
      this.guardianStatus.success = true;
      this.guardian = null;
      this.displayGuardianDialog = false;
      this.getGuardians(this.route.snapshot.params['id']);
      this.getFamily(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.guardianStatus.success = false;
        this.guardianStatus.message = 'An unexpected error occurred';
      } else {
        if (err.status === 404) {
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'Guardian not found';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'An error occurred while deleting the guardian';
        }
      }
    });
  }

  confirmDeleteGuardian(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this guardian?',
      header: 'Delete Guardian Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteGuardian(id);
      }
    })
  }

  saveStudent(student: Student) {
    // If the student is not new, then update the selected student
    if (this.newStudent === false) {
      this.studentService.updateStudent(student).then(() => {
        this.studentStatus.success = true;
        this.student = null;
        this.displayStudentDialog = false;
        this.getStudents(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.studentStatus.success = false;
          this.studentStatus.message = 'An unexpected error occurred';
        } else {
          if (err.status === 400) {
            this.studentStatus.success = false;
            this.studentStatus.message = 'Missing a required field';
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.studentStatus.success = false;
            this.studentStatus.message = 'An error occurred while updating the student';
          }
        }
      })
    } else {
      let studentID = ObjectID();
      let studentToCreate: Student = {
        _id: studentID,
        fname: student.fname,
        lname: student.lname,
        mi: student.mi,
        notes: student.notes,
        checkedIn: false,
        familyUnitID: this.route.snapshot.params['id'],
        active: true
      };
      this.studentService.createStudent(studentToCreate).subscribe(() => {
        this.studentStatus.success = true;
        this.student = null;
        this.displayStudentDialog = false;
        this.getStudents(this.route.snapshot.params['id']);
        this.getFamily(this.route.snapshot.params['id']);
      }, err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.studentStatus.success = false;
          this.studentStatus.message = 'An unexpected error occurred';
        } else {
          if (err.status === 400) {
            this.studentStatus.success = false;
            this.studentStatus.message = 'Missing a required field';
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.studentStatus.success = false;
            this.studentStatus.message = 'An error occurred while enrolling the student ' + student.fname + ' ' + student.lname;
          }
        }
      });
    }
  }

  saveGuardian(guardian: Guardian) {
    if (this.newGuardian === false) {
      this.guardianService.updateGuardian(guardian).then(() => {
        this.guardianStatus.success = true;
        this.guardian = null;
        this.displayGuardianDialog = false;
        this.getGuardians(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'An unexpected error occurred';
        } else {
          if (err.status === 400) {
            this.guardianStatus.success = false;
            this.guardianStatus.message = 'Missing a required field';
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.guardianStatus.success = false;
            this.guardianStatus.message = 'An error occurred while updating the guardian';
          }
        }
      })
    } else {
      let guardianID = ObjectID();
      let guardianToCreate: Guardian = {
        _id: guardianID,
        fname: guardian.fname,
        lname: guardian.lname,
        mi: guardian.mi,
        relationship: guardian.relationship,
        primPhone: guardian.primPhone,
        secPhone: guardian.secPhone,
        email: guardian.email,
        familyUnitID: this.route.snapshot.params['id'],
        active: true
      };
      this.guardianService.createGuardian(guardianToCreate).subscribe(() => {
        this.guardianStatus.success = true;
        this.guardian = null;
        this.displayGuardianDialog = false;
        this.getGuardians(this.route.snapshot.params['id']);
        this.getFamily(this.route.snapshot.params['id']);
      }, err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'An unexpected error occurred';
        } else {
          if (err.status === 400) {
            this.guardianStatus.success = false;
            this.guardianStatus.message = 'Missing a required field';
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.guardianStatus.success = false;
            this.guardianStatus.message = 'An error occurred while creating the guardian ' + guardian.fname + ' ' + guardian.lname;
          }
        }
      });
    }
  }

  showUpdateFamilyForm() {
    this.familyService.getFamily(this.route.snapshot.params['id']).then(family => {
      this.editableFamily = family;
      this.displayFamilyForm = true;
      this.familyStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.familyStatus.success = false;
        this.familyStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.familyStatus.success = false;
        this.familyStatus.message = 'An error occurred while loading the family';
      }
    })
  }

  hideUpdateFamilyForm() {
    this.displayFamilyForm = false;
  }

  updateFamilyName() {
    this.familyService.updateFamily(this.editableFamily).then(() => {
      this.familyStatus.success = true;
      this.displayFamilyForm = false;
      this.editableFamily = null;
      this.getFamily(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.familyStatus.success = false;
        this.familyStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.familyStatus.success = false;
        this.familyStatus.message = 'An error occurred while saving the family';
      }
    })
  }

  onStudentSelect(event) {
    this.newStudent = false;
    this.studentService.getStudent(event.data._id).then(student => {
      this.student = student;
      this.displayStudentDialog = true;
      this.studentStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.studentStatus.success = false;
        this.studentStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.studentStatus.success = false;
        this.studentStatus.message = 'An error occurred while loading the student';
      }
    });
    this.displayStudentDialog = true;
  }

  onGuardianSelect(event) {
    this.newGuardian = false;
    this.guardianService.getGuardian(event.data._id).then(guardian => {
      this.guardian = guardian;
      this.displayGuardianDialog = true;
      this.guardianStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.guardianStatus.success = false;
        this.guardianStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.guardianStatus.success = false;
        this.guardianStatus.message = 'An error occurred while loading the guardian';
      }
    });
    this.displayGuardianDialog = true;
  }

  showDialogToAddStudent() {
    this.newStudent = true;
    this.student = new Student();
    this.displayStudentDialog = true;
  }

  showDialogToAddGuardian() {
    this.newGuardian = true;
    this.guardian = new Guardian();
    this.displayGuardianDialog = true;
  }
}
