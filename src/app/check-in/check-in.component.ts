import { Component, OnInit } from '@angular/core';
import {Student} from "../models/student";
import {Router} from "@angular/router";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {

  students: Student[] = [];
  selectedStudents: Student[] = [];

  constructor(private router: Router) {
    this.students = [{
      _id: '123',
      fname: 'Billy',
      lname: 'Smith',
      mi: 'J',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '124',
      fname: 'Suzie',
      lname: 'Johnson',
      mi: 'F',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '125',
      fname: 'Mary',
      lname: 'Anderson',
      mi: 'J',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '126',
      fname: 'Jeff',
      lname: 'Davenport',
      mi: 'B',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '127',
      fname: 'Phil',
      lname: 'Jones',
      mi: 'R',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '128',
      fname: 'Jane',
      lname: 'Richmond',
      mi: 'L',
      notes: '',
      familyUnitID: '1234'
    }];
  }

  ngOnInit() {
  }

  goToCheckInDetails() {
    this.router.navigate(['/check-in-details']);
  }

}
