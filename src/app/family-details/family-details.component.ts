import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {Status} from "../error-alert/error-alert.component";
import {Family} from "../models/family";
import {Student} from "../models/student";
import {Guardian} from "../models/guardian";
import {FamilyService} from "../service/family.service";
import {StudentService} from "../service/student.service";
import {GuardianService} from "../service/guardian.service";
import {ObjectID} from 'bson';
import {AuthenticationService} from "../service/authentication.service";

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
              private guardianService: GuardianService, private route: ActivatedRoute,
              private location: Location, private authService: AuthenticationService) {
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
      this.students = students.json().students;
      this.studentsStatus.success = true;
    }).catch(err => {
      console.log(err);
      this.studentsStatus.success = false;
      this.studentsStatus.message = 'An error occurred while loading the students';
    });
    this.studentsLoading = false;
  }

  getGuardians(familyUnitID: string) {
    this.guardiansLoading = true;
    this.guardianService.getGuardians(familyUnitID).then(guardians => {
      this.guardians = guardians.json().guardians;
      this.guardiansStatus.success = true;
    }).catch(err => {
      console.log(err);
      this.guardiansStatus.success = false;
      this.guardiansStatus.message = 'An error occurred while loading the guardians';
    });
    this.guardiansLoading = false;
  }

  getFamily(id: number) {
    this.familyService.getFamily(id).then(family => {
      this.family = family.json();
      this.familyStatus.success = true;
    }).catch(err => {
      console.log(err);
      this.familyStatus.success = false;
      this.familyStatus.message = 'An occurred while loading the family';
    })
  }

  deleteFamily() {
    let deleteStudents = new Promise((resolve, reject) => {
      for (let studentIndex in this.students) {
        this.studentService.deleteStudent(this.students[studentIndex]._id).then(() => {
          this.studentsStatus.success = true;
        }).catch(err => {
          reject(err);
          return;
        })
      }
      resolve();
    });

    let deleteGuardians = new Promise((resolve, reject) => {
      for (let guardianIndex in this.guardians) {
        this.guardianService.deleteGuardian(this.guardians[guardianIndex]._id).then(() => {
          this.guardiansStatus.success = true;
        }).catch(err => {
          reject(err);
          return;
        })
      }
      resolve();
    });

    deleteStudents.then(() => {
      deleteGuardians.then(() => {
        this.familyService.deleteFamily(this.route.snapshot.params['id']).then(() => {
          this.familyStatus.success = true;
          this.location.back();
        }).catch(err => {
          console.log(err);
          this.familyStatus.success = false;
          this.familyStatus.message = 'An error occurred while deleting the family';
        })
      }).catch(err => {
        console.log(err);
        this.guardiansStatus.success = false;
        this.guardiansStatus.message = 'An error occurred while deleting the guardians';
      })
    }).catch(err => {
      console.log(err);
      this.studentsStatus.success = false;
      this.studentsStatus.message = 'An error occurred while deleting the students';
    })
  }

  deleteStudent(id: string) {
    if (this.family.students.length === 1) {
      this.studentStatus.success = false;
      this.studentStatus.message = 'A family must have at least 1 child';
      return;
    }

    // Remove student ID from family record
    let deleteStudentFromFamilyRecord = new Promise((resolve, reject) => {
      for (let familyIndex in this.family.students) {
        if (this.family.students[familyIndex] == id) {
          // If student ID is found in family record, remove it from the student's array
          this.family.students.splice(+familyIndex, 1);
          this.familyService.updateFamily(this.family).then(() => {
            this.studentStatus.success = true;
          }).catch(err => {
            reject(err);
            return;
          })
        }
      }
      resolve();
    });

    deleteStudentFromFamilyRecord.then(() => {
      this.studentService.deleteStudent(id).then(() => {
        this.studentStatus.success = true;
        this.student = null;
        this.displayStudentDialog = false;
        this.getStudents(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.status === 404) {
          this.studentStatus.success = false;
          this.studentStatus.message = 'Student not found';
        } else {
          console.log(err);
          this.studentStatus.success = false;
          this.studentStatus.message = 'An error occurred while deleting the student';
        }
      })
    }).catch(err => {
      console.log(err);
      this.studentStatus.success = false;
      this.studentStatus.message = 'An error occurred updating the family record';
    });
  }

  deleteGuardian(id: string) {
    if (this.family.guardians.length === 1) {
      this.guardianStatus.success = false;
      this.guardianStatus.message = 'A family must have at least 1 guardian';
      return;
    }

    // Remove guardian ID from family record
    let deleteGuardianFromFamilyRecord = new Promise((resolve, reject) => {
      for (let familyIndex in this.family.guardians) {
        if (this.family.guardians[familyIndex] == id) {
          // If student ID is found in family record, remove it from the student's array
          this.family.guardians.splice(+familyIndex, 1);
          this.familyService.updateFamily(this.family).then(() => {
            this.guardianStatus.success = true;
          }).catch(err => {
            reject(err);
            return;
          })
        }
      }
      resolve();
    });

    deleteGuardianFromFamilyRecord.then(() => {
      // Remove guardian from guardian collection
      this.guardianService.deleteGuardian(id).then(() => {
        this.guardianStatus.success = true;
        this.guardian = null;
        this.displayGuardianDialog = false;
        this.getGuardians(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.status === 404) {
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'Guardian not found';
        } else {
          console.log(err);
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'An error occurred while deleting the guardian';
        }
      })
    }).catch(err => {
      console.log(err);
      this.guardianStatus.success = false;
      this.guardianStatus.message = 'An error occurred updating the family record';
    });
  }

  saveStudent(student: Student) {
    // If the student is not new, then update the selected student
    if (this.newStudent === false) {
      this.studentService.updateStudent(student).then(() => {
        this.student = null;
        this.displayStudentDialog = false;
        this.getStudents(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.status === 400) {
          this.studentStatus.success = false;
          this.studentStatus.message = 'Missing a required field';
        } else {
          console.log(err);
          this.studentStatus.success = false;
          this.studentStatus.message = 'An error occurred while updating the student';
        }
      })
    } else {
      let createStudentPromise = new Promise((resolve, reject) => {
        let studentID = ObjectID();
        this.studentService.createStudent(studentID, student.fname, student.lname, student.mi, student.notes,
          this.route.snapshot.params['id']).subscribe(() => {
          this.studentStatus.success = true;
          resolve(studentID);
        }, err => {
          reject(err);
          return;
        });
      });

      createStudentPromise.then((studentID: string) => {
        this.family.students.push(studentID);
        this.familyService.updateFamily(this.family).then(() => {
          this.studentStatus.success = true;
          this.student = null;
          this.displayStudentDialog = false;
          this.getStudents(this.route.snapshot.params['id']);
        }).catch(err => {
          console.log(err);
          this.studentStatus.success = false;
          this.studentStatus.message = 'An error occurred updating the family record';
        })
      }).catch(err => {
        if (err.status === 400) {
          this.studentStatus.success = false;
          this.studentStatus.message = 'Missing a required field';
        } else {
          console.log(err);
          this.studentStatus.success = false;
          this.studentStatus.message = 'An error occurred while enrolling the student ' + student.fname + ' ' + student.lname;
        }
      })
    }
  }

  saveGuardian(guardian: Guardian) {
    if (this.newGuardian === false) {
      this.guardianService.updateGuardian(guardian).then(() => {
        this.guardian = null;
        this.displayGuardianDialog = false;
        this.getGuardians(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.status === 400) {
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'Missing a required field';
        } else {
          console.log(err);
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'An error occurred while updating the guardian';
        }
      })
    } else {
      let createGuardianPromise = new Promise((resolve, reject) => {
        let guardianID = ObjectID();
        this.guardianService.createGuardian(guardianID, guardian.fname, guardian.lname, guardian.mi,
          guardian.relationship, guardian.primPhone, guardian.secPhone, guardian.email,
          this.route.snapshot.params['id']).subscribe(() => {
          this.guardianStatus.success = true;
          resolve(guardianID);
        }, err => {
          reject(err);
          return;
        });
      });

      createGuardianPromise.then((guardianID: string) => {
        this.family.guardians.push(guardianID);
        this.familyService.updateFamily(this.family).then(() => {
          this.guardianStatus.success = true;
          this.guardian = null;
          this.displayGuardianDialog = false;
          this.getGuardians(this.route.snapshot.params['id']);
        }).catch(err => {
          console.log(err);
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'An error occurred updating the family record';
        })
      }).catch(err => {
        if (err.status === 400) {
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'Missing a required field';
        } else {
          console.log(err);
          this.guardianStatus.success = false;
          this.guardianStatus.message = 'An error occurred while creating the guardian ' + guardian.fname + ' ' + guardian.lname;
        }
      })
    }
  }

  showUpdateFamilyForm() {
    this.familyService.getFamily(this.route.snapshot.params['id']).then(family => {
      this.editableFamily = JSON.parse(family._body);
      this.displayFamilyForm = true;
      this.familyStatus.success = true;
    }).catch(err => {
      console.log(err);
      this.familyStatus.success = false;
      this.familyStatus.message = 'An error occurred while loading the family';
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
      console.log(err);
      this.familyStatus.success = false;
      this.familyStatus.message = 'An error occurred while saving the family';
    })
  }

  onStudentSelect(event) {
    this.newStudent = false;
    this.studentService.getStudent(event.data._id).then(student => {
      this.student = JSON.parse(student._body);
      this.displayStudentDialog = true;
      this.studentStatus.success = true;
    }).catch(err => {
      console.log(err);
      this.studentStatus.success = false;
      this.studentStatus.message = 'An error occurred while loading the student';
    });
    this.displayStudentDialog = true;
  }

  onGuardianSelect(event) {
    this.newGuardian = false;
    this.guardianService.getGuardian(event.data._id).then(guardian => {
      this.guardian = JSON.parse(guardian._body);
      this.displayGuardianDialog = true;
      this.guardianStatus.success = true;
    }).catch(err => {
      console.log(err);
      this.guardianStatus.success = false;
      this.guardianStatus.message = 'An error occurred while loading the guardian';
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
