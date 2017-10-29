import {Component, OnInit} from '@angular/core';
import {Student} from "../../models/student";
import {Router} from "@angular/router";
import {StudentService} from "../../service/student.service";
import {Status} from "../error-alert/error-alert.component";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {

  students: Student[] = [];
  selectedStudents: Student[] = [];
  studentsStatus: Status;
  studentsLoading: boolean = true;
  order: string = 'lname';

  constructor(private router: Router, private studentService: StudentService) {
    this.studentsStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.studentsLoading = true;
    this.studentService.getCheckedInStudents().then(students => {
      this.students = students.json().students;
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

  goToCheckOutDetails() {
    let idArray: String[] = [];
    for(let studentIndex in this.selectedStudents) {
      idArray.push(this.selectedStudents[studentIndex]._id);
    }
    this.router.navigate(['check-out-details'], {queryParams: {id: [idArray]}});
  }
}
