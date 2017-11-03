import {Injectable} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";
import {ObjectID} from 'bson';
import {Guardian} from "../models/guardian";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class GuardianService {
  private gplsApiUrl: string;

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getGuardian(id: string): Promise<Guardian> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/guardians/${id}`;
    return this.http.get<Guardian>(url, {headers: headers})
      .toPromise();
  }

  getGuardians(familyUnitID: string): Promise<Guardian> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/guardians?familyUnitID=${familyUnitID}`;
    return this.http.get<Guardian>(url, {headers: headers})
      .toPromise();
  }

  createGuardian(guardian: Guardian) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/guardians`;
    return this.http.post(url, guardian, {
      headers: headers,
      responseType: 'text'
    });
  }

  updateGuardian(guardian: Guardian): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/guardians/${guardian._id}`;
    return this.http.put(url, guardian, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  deleteGuardian(id: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const url = `${this.gplsApiUrl}/guardians/${id}`;
    return this.http.delete(url, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }
}
