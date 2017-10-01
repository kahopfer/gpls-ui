import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";
import { ObjectID } from 'bson';

@Injectable()
export class GuardianService {
  private gplsApiUrl: string;

  constructor(private http: Http) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getGuardians(familyUnitID: string): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/guardians?familyUnitID=${familyUnitID}`;
    return this.http.get(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  createGuardian(id: ObjectID, fname: string, lname: string, mi: string, relationship: string, primPhone: string,
                 secPhone: string, email: string, familyUnitID: ObjectID) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/guardians`;
    return this.http.post(url, JSON.stringify({
      _id: id,
      fname: fname,
      lname: lname,
      mi: mi,
      relationship: relationship,
      primPhone: primPhone,
      secPhone: secPhone,
      email: email,
      familyUnitID: familyUnitID
    }), {headers: headers});
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
