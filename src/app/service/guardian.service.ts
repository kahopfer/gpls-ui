import {Injectable} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";
import {ObjectID} from 'bson';
import {Guardian} from "../models/guardian";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class GuardianService {
  private gplsApiUrl: string;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getGuardian(id: string): Promise<Guardian> {
    const url = `${this.gplsApiUrl}/guardians/${id}`;
    return this.http.get<Guardian>(url, {headers: this.headers}).toPromise();
  }

  getGuardians(familyUnitID: string): Promise<Guardian[]> {
    const url = `${this.gplsApiUrl}/guardians?familyUnitID=${familyUnitID}`;
    return this.http.get<Guardian[]>(url, {headers: this.headers}).toPromise();
  }

  createGuardian(guardian: Guardian) {
    const url = `${this.gplsApiUrl}/guardians`;
    return this.http.post(url, guardian, {
      headers: this.headers,
      responseType: 'text'
    });
  }

  updateGuardian(guardian: Guardian): Promise<string> {
    const url = `${this.gplsApiUrl}/guardians/${guardian._id}`;
    return this.http.put(url, guardian, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }

  deleteGuardian(id: string): Promise<string> {
    const url = `${this.gplsApiUrl}/guardians/${id}`;
    return this.http.delete(url, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }
}
