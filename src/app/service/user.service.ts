import {Injectable} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user";

@Injectable()
export class UserService {
  private gplsApiUrl: string;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getUsers(): Promise<User[]> {
    const url = `${this.gplsApiUrl}/users`;
    return this.http.get<User[]>(url, {headers: this.headers})
      .toPromise();
  }

  createUser(user: User): Promise<string> {
    const url = `${this.gplsApiUrl}/users`;
    return this.http.post(url, user, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }

  changePassword(oldPassword: string, newPassword: string): Promise<string> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const url = `${this.gplsApiUrl}/users`;

    return this.http.put(url, {
      username: currentUser.username,
      password: newPassword
    }, {
      headers: this.headers.append('Old-Password', oldPassword),
      responseType: 'text'
    }).toPromise();
  }

  resetPassword(username: string, newPassword: string): Promise<string> {
    const url = `${this.gplsApiUrl}/users/resetPassword/${username}`;

    return this.http.put(url, {
      username: username,
      password: newPassword
    }, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }

  deleteUser(userToDelete: string): Promise<string> {
    const url = `${this.gplsApiUrl}/users/${userToDelete}`;
    return this.http.delete(url, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }
}
