import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {Family} from "../../models/family";
import {Student} from "../../models/student";
import {Guardian} from "../../models/guardian";
import {FamilyService} from "../../service/family.service";
import {StudentService} from "../../service/student.service";
import {GuardianService} from "../../service/guardian.service";
import {ObjectID} from 'bson';
import {AuthenticationService} from "../../service/authentication.service";
import {ConfirmationService, MenuItem, Message} from "primeng/primeng";

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
  inactiveStudents: Student[] = [];
  inactiveGuardians: Guardian[] = [];

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

  msgs: Message[] = [];

  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;

  inactiveStudentsLoading: boolean = true;
  inactiveGuardiansLoading: boolean = true;

  studentItems: MenuItem[];
  guardianItems: MenuItem[];

  displayActiveStudents: boolean = true;
  displayInactiveStudents: boolean = false;

  displayActiveGuardians: boolean = true;
  displayInactiveGuardians: boolean = false;

  constructor(private familyService: FamilyService, private studentService: StudentService,
              private guardianService: GuardianService, private route: ActivatedRoute, private location: Location,
              private authService: AuthenticationService, private confirmationService: ConfirmationService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.admin = currentUser && currentUser.admin;
  }

  ngOnInit(): void {
    this.adminSub = this.authService.getAdmin.subscribe(admin => this.changeAdmin(admin));
    this.getFamily(this.route.snapshot.params['id']);
    this.getStudents(this.route.snapshot.params['id']);
    this.getGuardians(this.route.snapshot.params['id']);
    if (this.admin) {
      this.getInactiveStudents(this.route.snapshot.params['id']);
      this.getInactiveGuardians(this.route.snapshot.params['id']);
      this.studentItems = [
        {
          label: 'Active Students', command: () => {
          this.showActiveStudents();
        }
        },
        {
          label: 'Inactive Students', command: () => {
          this.showInactiveStudents();
        }
        }
      ];
      this.guardianItems = [
        {
          label: 'Active Guardians', command: () => {
          this.showActiveGuardians();
        }
        },
        {
          label: 'Inactive Guardians', command: () => {
          this.showInactiveGuardians();
        }
        }
      ];
    } else {
      this.studentItems = [
        {
          label: 'Active Students', command: () => {
          this.showActiveStudents();
        }
        }
      ];
      this.guardianItems = [
        {
          label: 'Active Guardians', command: () => {
          this.showActiveGuardians();
        }
        }
      ];
    }
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
    this.guardianService.getGuardians(familyUnitID).then(guardians => {
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

  getInactiveStudents(familyUnitID: string) {
    this.inactiveStudentsLoading = true;
    this.studentService.getInactiveStudents(familyUnitID).then(students => {
      this.inactiveStudents = students['students'];
      this.inactiveStudentsLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the inactive students'
        });
      }
      this.inactiveStudentsLoading = false;
    });
  }

  getInactiveGuardians(familyUnitID: string) {
    this.inactiveGuardiansLoading = true;
    this.guardianService.getInactiveGuardians(familyUnitID).then(guardians => {
      this.inactiveGuardians = guardians['guardians'];
      this.inactiveGuardiansLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the inactive guardians'
        });
      }
      this.inactiveGuardiansLoading = false;
    });
  }

  showActiveStudents() {
    this.displayActiveStudents = true;
    this.displayInactiveStudents = false;
  }

  showInactiveStudents() {
    this.displayActiveStudents = false;
    this.displayInactiveStudents = true;
  }

  showActiveGuardians() {
    this.displayActiveGuardians = true;
    this.displayInactiveGuardians = false;
  }

  showInactiveGuardians() {
    this.displayActiveGuardians = false;
    this.displayInactiveGuardians = true;
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

  confirmDeactivateFamily() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to deactivate this family?',
      header: 'Deactivate Family Confirmation',
      icon: 'fa fa-close',
      accept: () => {
        this.deactivateFamily();
      }
    })
  }

  deactivateFamily() {
    this.family.active = false;
    this.familyService.updateActiveFamily(this.family).then(() => {
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
            detail: 'You cannot deactivate a family with either uninvoiced line items or unpaid invoices'
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
      this.family.active = true;
    });
  }

  deactivateStudent(student: Student) {
    if (this.students.length === 1) {
      this.msgs.push({
        severity: 'error',
        summary: 'Error Message',
        detail: 'A family must have at least 1 active child'
      });
      return;
    }
    student.active = false;
    this.studentService.updateActiveStudent(this.student).then(() => {
      this.student = null;
      this.displayStudentDialog = false;
      this.getStudents(this.route.snapshot.params['id']);
      this.getFamily(this.route.snapshot.params['id']);
      this.getInactiveStudents(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        if (err.status === 404) {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Student not found'});
        } else if (err.status === 400) {
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Cannot deactivate a student with uninvoiced line items'
          });
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while deactivating the student'
          });
        }
      }
      student.active = true;
    })
  }

  confirmDeactivateStudent(student: Student) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to deactivate this student?',
      header: 'Deactivate Student Confirmation',
      icon: 'fa fa-close',
      accept: () => {
        this.deactivateStudent(student);
      }
    })
  }

  deactivateGuardian(guardian: Guardian) {
    if (this.guardians.length === 1) {
      this.msgs.push({
        severity: 'error',
        summary: 'Error Message',
        detail: 'A family must have at least 1 active guardian'
      });
      return;
    }
    guardian.active = false;
    this.guardianService.updateActiveGuardian(guardian).then(() => {
      this.guardian = null;
      this.displayGuardianDialog = false;
      this.getGuardians(this.route.snapshot.params['id']);
      this.getFamily(this.route.snapshot.params['id']);
      this.getInactiveGuardians(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        if (err.status === 404) {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Guardian not found'});
        } else if (err.status === 400) {
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'A family must have at least 1 active guardian'
          });
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while deactivating the guardian'
          });
        }
      }
      guardian.active = true;
    });
  }

  confirmDeactivateGuardian(guardian: Guardian) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to deactivate this guardian?',
      header: 'Deactivate Guardian Confirmation',
      icon: 'fa fa-close',
      accept: () => {
        this.deactivateGuardian(guardian);
      }
    })
  }

  reactivateStudent(student: Student) {
    student.active = true;
    this.studentService.updateActiveStudent(this.student).then(() => {
      this.student = null;
      this.displayStudentDialog = false;
      this.getStudents(this.route.snapshot.params['id']);
      this.getFamily(this.route.snapshot.params['id']);
      this.getInactiveStudents(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        if (err.status === 404) {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Student not found'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while reactivating the student'
          });
        }
      }
      student.active = false;
    })
  }

  confirmReactivateStudent(student: Student) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reactivate this student?',
      header: 'Reactivate Student Confirmation',
      icon: 'fa fa-check',
      accept: () => {
        this.reactivateStudent(student);
      }
    })
  }

  reactivateGuardian(guardian: Guardian) {
    guardian.active = true;
    this.guardianService.updateActiveGuardian(guardian).then(() => {
      this.guardian = null;
      this.displayGuardianDialog = false;
      this.getGuardians(this.route.snapshot.params['id']);
      this.getFamily(this.route.snapshot.params['id']);
      this.getInactiveGuardians(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        if (err.status === 404) {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Guardian not found'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while reactivating the guardian'
          });
        }
      }
      guardian.active = false;
    });
  }

  confirmReactivateGuardian(guardian: Guardian) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reactivate this guardian?',
      header: 'Reactivate Guardian Confirmation',
      icon: 'fa fa-check',
      accept: () => {
        this.reactivateGuardian(guardian);
      }
    })
  }

  saveStudent(student: Student) {
    // If the student is not new, then update the selected student
    if (this.newStudent === false) {
      this.studentService.updateStudent(student).then(() => {
        this.student = null;
        this.displayStudentDialog = false;
        this.getStudents(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          if (err.status === 400) {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Missing a required field'});
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred while updating the student'
            });
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
        this.student = null;
        this.displayStudentDialog = false;
        this.getStudents(this.route.snapshot.params['id']);
        this.getFamily(this.route.snapshot.params['id']);
      }, err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          if (err.status === 400) {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Missing a required field'});
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred while enrolling the student ' + student.fname + ' ' + student.lname
            });
          }
        }
      });
    }
  }

  saveGuardian(guardian: Guardian) {
    if (this.newGuardian === false) {
      this.guardianService.updateGuardian(guardian).then(() => {
        this.guardian = null;
        this.displayGuardianDialog = false;
        this.getGuardians(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          if (err.status === 400) {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Missing a required field'});
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred while updating the guardian'
            });
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
        this.guardian = null;
        this.displayGuardianDialog = false;
        this.getGuardians(this.route.snapshot.params['id']);
        this.getFamily(this.route.snapshot.params['id']);
      }, err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          if (err.status === 400) {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Missing a required field'});
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred while creating the guardian ' + guardian.fname + ' ' + guardian.lname
            });
          }
        }
      });
    }
  }

  showUpdateFamilyForm() {
    this.familyService.getFamily(this.route.snapshot.params['id']).then(family => {
      this.editableFamily = family;
      this.displayFamilyForm = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the family'
        });
      }
    })
  }

  hideUpdateFamilyForm() {
    this.displayFamilyForm = false;
  }

  updateFamilyName() {
    this.familyService.updateFamily(this.editableFamily).then(() => {
      this.displayFamilyForm = false;
      this.editableFamily = null;
      this.getFamily(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while saving the family'
        });
      }
    })
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

  showDialogToAddStudent() {
    this.newStudent = true;
    this.student = new Student();
    this.student.active = true;
    this.displayStudentDialog = true;
  }

  showDialogToAddGuardian() {
    this.newGuardian = true;
    this.guardian = new Guardian();
    this.guardian.active = true;
    this.displayGuardianDialog = true;
  }
}
