import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Status} from "../error-alert/error-alert.component";
import {Family} from "../models/family";
import {Student} from "../models/student";
import {Guardian} from "../models/guardian";
import {FamilyService} from "../service/family.service";
import {StudentService} from "../service/student.service";
import {GuardianService} from "../service/guardian.service";

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.css']
})

export class FamilyDetailsComponent implements OnInit {
  family: Family = new Family;
  students: Student[] = [];
  guardians: Guardian[] = [];

  studentsStatus: Status;
  guardiansStatus: Status;

  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;

  constructor(private familyService: FamilyService, private studentService: StudentService,
              private guardianService: GuardianService, private route: ActivatedRoute) {
    this.studentsStatus = {
      success: null,
      message: null
    };

    this.guardiansStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit(): void {
    this.getFamily(this.route.snapshot.params['id']);
    this.getStudents(this.route.snapshot.params['id']);
    this.getGuardians(this.route.snapshot.params['id']);
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
    }).catch(err => {
      console.log(err);
    })
  }
}
