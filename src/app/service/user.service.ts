import {Injectable} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user";

@Injectable()
export class UserService {
  private gplsApiUrl: string;

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getUsers(): Promise<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/users`;
    return this.http.get<User>(url, {headers: headers})
      .toPromise();
  }

  createUser(user: User): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/users`;
    return this.http.post(url, user, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  changePassword(oldPassword: string, newPassword: string): Promise<string> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Old-Password': oldPassword
    });
    const url = `${this.gplsApiUrl}/users`;

    return this.http.put(url, {
      username: currentUser.username,
      password: newPassword
    }, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  resetPassword(username: string, newPassword: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/users/resetPassword/${username}`;

    return this.http.put(url, {
      username: username,
      password: newPassword
    }, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  deleteUser(userToDelete: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/users/${userToDelete}`;
    return this.http.delete(url, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }
}
