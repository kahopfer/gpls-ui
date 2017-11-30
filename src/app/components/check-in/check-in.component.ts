import {Component, OnInit} from '@angular/core';
import {Student} from "../../models/student";
import {Router} from "@angular/router";
import {StudentService} from "../../service/student.service";
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {

  students: Student[] = [];
  selectedStudents: Student[] = [];
  studentsLoading: boolean = true;
  order: string = 'lname';
  msgs: Message[] = [];

  constructor(private router: Router, private studentService: StudentService) {
  }

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.studentsLoading = true;
    this.studentService.getCheckedOutStudents().then(students => {
      this.students = students['data']['students'];
      this.studentsLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        try {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
        } catch (e) {
          if (err.status === 401) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Unauthorized. Please try logging out and logging back in again.'
            });
          } else {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
          }
        }
      }
      this.studentsLoading = false;
    });
  }

  goToCheckInDetails() {
    let idArray: String[] = [];
    for (let studentIndex in this.selectedStudents) {
      idArray.push(this.selectedStudents[studentIndex]._id);
    }
    this.router.navigate(['sign-in-details'], {queryParams: {id: [idArray]}});
  }
}
