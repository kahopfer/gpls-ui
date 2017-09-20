import {EventEmitter, Injectable, Output} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map'
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {GPLS_API_URL} from "../app.constants";

@Injectable()
export class AuthenticationService {
  // Used for correctly displaying the username in the navbar
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  // @Output() isAdmin: EventEmitter<any> = new EventEmitter();

  public token: string;

  // Used for showing the navbar when logged in and hiding it when logged out
  private loggedIn = new BehaviorSubject<boolean>(false);

  private headers = new Headers({'Content-Type': 'application/json'});

  private gplsApiUrl: string;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private http: Http) {
    // set token if saved in local storage
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;

    this.gplsApiUrl = GPLS_API_URL;

    if (currentUser) {
      this.loggedIn.next(true);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.gplsApiUrl}/auth`;
    return this.http.post(url, JSON.stringify({username: username, password: password}), {headers: this.headers})
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token = response.json() && response.json().token;

        let firstname = response.json() && response.json().firstname;
        let lastname = response.json() && response.json().lastname;
        let authorities = response.json() && response.json().authorities;
        let admin: boolean = false;

        for (let i in authorities) {
          if (authorities[i].authority === 'ROLE_ADMIN') {
            admin = true;
          }
        }

        if (token) {
          // set token property
          this.token = token;

          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            token: token,
            firstname: firstname,
            lastname: lastname,
            admin: admin
          }));

          // Used to show navbar
          this.loggedIn.next(true);

          // Used to display name on navbar
          this.getLoggedInName.emit(firstname + ' ' + lastname);

          // return true to indicate successful login
          return true;
        } else {
          this.getLoggedInName.emit('');

          // return false to indicate failed login
          return false;
        }
      });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.loggedIn.next(false);
    this.getLoggedInName.emit('');
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
