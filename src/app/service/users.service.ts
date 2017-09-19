import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";

@Injectable()
export class UsersService {
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

  getUsers(): Promise<any> {
    const url = `${this.gplsApiUrl}/users`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  createUser(username: string, password: string, firstname: string, lastname: string, admin: string): Promise<any> {
    const url = `${this.gplsApiUrl}/users`;
    if (JSON.parse(admin)) {
      return this.http.post(url, JSON.stringify({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        authorities: [
          'ROLE_USER',
          'ROLE_ADMIN'
        ]
      }), {headers: this.headers})
        .toPromise()
        .catch(this.handleError);
    } else {
      return this.http.post(url, JSON.stringify({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        authorities: [
          'ROLE_USER'
        ]
      }), {headers: this.headers})
        .toPromise()
        .catch(this.handleError);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
