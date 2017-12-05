import {Injectable} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";
import {ObjectID} from 'bson';
import {Student} from "../models/student";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class StudentService {
  private gplsApiUrl: string;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getStudent(id: string): Promise<Student> {
    const url = `${this.gplsApiUrl}/students/${id}`;
    return this.http.get<Student>(url, {headers: this.headers}).toPromise();
  }

  getStudents(familyUnitID: string): Promise<Student[]> {
    const url = `${this.gplsApiUrl}/students?familyUnitID=${familyUnitID}`;
    return this.http.get<Student[]>(url, {headers: this.headers}).toPromise();
  }

  getInactiveStudents(familyUnitID: string): Promise<Student[]> {
    const url = `${this.gplsApiUrl}/students/inactive?familyUnitID=${familyUnitID}`;
    return this.http.get<Student[]>(url, {headers: this.headers}).toPromise();
  }

  getCheckedOutStudents(): Promise<Student[]> {
    const url = `${this.gplsApiUrl}/students?checkedIn=false`;
    return this.http.get<Student[]>(url, {headers: this.headers}).toPromise();
  }

  getCheckedInStudents(): Promise<Student[]> {
    const url = `${this.gplsApiUrl}/students?checkedIn=true`;
    return this.http.get<Student[]>(url, {headers: this.headers}).toPromise();
  }

  createStudent(student: Student) {
    const url = `${this.gplsApiUrl}/students`;
    return this.http.post(url, student, {
      headers: this.headers,
      responseType: 'text'
    });
  }

  enrollStudent(student: Student) {
    const url = `${this.gplsApiUrl}/students/enrollStudent`;
    return this.http.post(url, student, {
      headers: this.headers,
      responseType: 'text'
    });
  }

  updateStudent(student: Student): Promise<string> {
    const url = `${this.gplsApiUrl}/students/updateStudent/${student._id}`;
    return this.http.put(url, student, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }

  updateActiveStudent(student: Student): Promise<string> {
    const url = `${this.gplsApiUrl}/students/updateActive/${student._id}`;
    return this.http.put(url, student, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }
}
