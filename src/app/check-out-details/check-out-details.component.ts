import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Location} from '@angular/common';
import {Student} from "../models/student";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-check-out-details',
  templateUrl: './check-out-details.component.html',
  styleUrls: ['./check-out-details.component.css']
})
export class CheckOutDetailsComponent implements OnInit {

  students: Student[] = [];

  constructor(private router: Router, private location: Location) {
    this.students = [{
      _id: '124',
      fname: 'John',
      lname: 'Stanton',
      mi: 'K',
      notes: '',
      familyUnitID: '1234'
    },{
      _id: '127',
      fname: 'Emily',
      lname: 'Davis',
      mi: 'C',
      notes: '',
      familyUnitID: '1234'
    }];
  }

  ngOnInit() {
  }

  checkStudentsOut(form: NgForm) {
    console.log(form.value);
    this.router.navigate(['/check-out'])
  }

  cancel() {
    this.location.back();
  }
}
