import {Injectable} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";
import {ObjectID} from 'bson';
import {Student} from "../models/student";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class StudentService {
  private gplsApiUrl: string;

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getStudent(id: string): Promise<Student> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/students/${id}`;
    return this.http.get<Student>(url, {headers: headers})
      .toPromise();
  }

  getStudents(familyUnitID: string): Promise<Student> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/students?familyUnitID=${familyUnitID}`;
    return this.http.get<Student>(url, {headers: headers})
      .toPromise();
  }

  getCheckedOutStudents(): Promise<Student> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/students?checkedIn=false`;
    return this.http.get<Student>(url, {headers: headers})
      .toPromise();
  }

  getCheckedInStudents(): Promise<Student> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/students?checkedIn=true`;
    return this.http.get<Student>(url, {headers: headers})
      .toPromise();
  }

  createStudent(student: Student) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/students`;
    return this.http.post(url, student, {
      headers: headers,
      responseType: 'text'
    });
  }

  updateStudent(student: Student): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/students/updateStudent/${student._id}`;
    return this.http.put(url, student, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  updateCheckedIn(student: Student): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/students/updateCheckedIn/${student._id}`;
    return this.http.put(url, student, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  deleteStudent(id: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const url = `${this.gplsApiUrl}/students/${id}`;
    return this.http.delete(url, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }
}
