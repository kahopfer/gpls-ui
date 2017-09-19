import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";

@Injectable()
export class GuardianService {
  private token: string;
  private headers: Headers;
  private headers1: Headers;
  private gplsApiUrl: string;

  constructor(private http: Http) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
    this.gplsApiUrl = GPLS_API_URL;
    this.headers1 = new Headers({'Accept': 'application/json', 'Content-Type': 'application/json'});
  }

  getGuardians(familyUnitID: string): Promise<any> {
    const url = `${this.gplsApiUrl}/guardians?familyUnitID=${familyUnitID}`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
