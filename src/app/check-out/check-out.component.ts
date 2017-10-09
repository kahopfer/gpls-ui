import { Component, OnInit } from '@angular/core';
import {Student} from "../models/student";
import {Router} from "@angular/router";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {

  students: Student[] = [];
  selectedStudents: Student[] = [];

  constructor(private router: Router) {
    this.students = [{
      _id: '123',
      fname: 'Fred',
      lname: 'Williams',
      mi: 'G',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '124',
      fname: 'John',
      lname: 'Stanton',
      mi: 'K',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '125',
      fname: 'Will',
      lname: 'Kennedy',
      mi: 'S',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '126',
      fname: 'Kelly',
      lname: 'White',
      mi: 'P',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '127',
      fname: 'Emily',
      lname: 'Davis',
      mi: 'C',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '128',
      fname: 'Millie',
      lname: 'Watters',
      mi: 'F',
      notes: '',
      familyUnitID: '1234'
    }];
  }

  ngOnInit() {
  }

  goToCheckOutDetails() {
    this.router.navigate(['/check-out-details']);
  }
}
