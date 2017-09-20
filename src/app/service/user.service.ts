import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";

@Injectable()
export class UserService {
  private gplsApiUrl: string;

  constructor(private http: Http) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getUsers(): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/users`;
    return this.http.get(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  createUser(username: string, password: string, firstname: string, lastname: string, admin: string): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
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
      }), {headers: headers})
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
      }), {headers: headers})
        .toPromise()
        .catch(this.handleError);
    }
  }

  deleteUser(userToDelete: string): Promise<void> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const myUsername = currentUser && currentUser.username;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/users/userToDelete/${userToDelete}/myUsername/${myUsername}`;
    return this.http.delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
