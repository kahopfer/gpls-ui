import {Component, OnInit} from '@angular/core';
import {Student} from "../../models/student";
import {Router} from "@angular/router";
import {Location} from '@angular/common';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-check-in-details',
  templateUrl: './check-in-details.component.html',
  styleUrls: ['./check-in-details.component.css']
})
export class CheckInDetailsComponent implements OnInit {
  students: Student[] = [];

  constructor(private router: Router, private location: Location) {
    this.students = [{
      _id: '125',
      fname: 'Mary',
      lname: 'Anderson',
      mi: 'J',
      notes: '',
      familyUnitID: '1234'
    }, {
      _id: '126',
      fname: 'Jeff',
      lname: 'Davenport',
      mi: 'B',
      notes: '',
      familyUnitID: '1234'
    }];
  }

  ngOnInit() {
  }

  checkStudentsIn(form: NgForm) {
    console.log(form.value);
    this.router.navigate(['/check-in'])
  }

  cancel() {
    this.location.back();
  }

}
