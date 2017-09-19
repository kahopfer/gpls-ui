import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../service/data.service";
import {Status} from "../error-alert/error-alert.component";
import {Location} from '@angular/common';
import {Family} from "../models/family";
import {Student} from "../models/student";
import {Guardian} from "../models/guardian";

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

  selectedStudents: Student[];
  selectedGuardians: Guardian[];

  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;

  constructor(private dataService: DataService, private route: ActivatedRoute, private location: Location) {
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
    this.dataService.getStudents(familyUnitID).then(students => {
      this.students = students.json().students;
      this.studentsStatus.success = true;
    }).catch(err => {
      this.studentsStatus.success = false;
      this.studentsStatus.message = err;
    });
    this.studentsLoading = false;
  }

  getGuardians(familyUnitID: string) {
    this.guardiansLoading = true;
    this.dataService.getGuardians(familyUnitID).then(guardians => {
      this.guardians = guardians.json().guardians;
      this.guardiansStatus.success = true;
    }).catch(err => {
      this.guardiansStatus.success = false;
      this.guardiansStatus.message = err;
    });
    this.guardiansLoading = false;
  }

  getFamily(id: number) {
    this.dataService.getFamily(id).then(family => {
      this.family = family.json();
    }).catch(err => {
      console.log(err);
    })
  }
}
