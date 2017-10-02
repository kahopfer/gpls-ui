import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = 'GPLS Care Tracker';
  isLoggedIn$: Observable<boolean>;
  username: string;
  fullName: string;
  admin: boolean;

  constructor(private authService: AuthenticationService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.fullName = currentUser && currentUser.firstname + ' ' + currentUser.lastname;
    this.username = currentUser && currentUser.username;
    this.admin = currentUser && currentUser.admin;

    authService.getLoggedInName.subscribe(name => this.changeFullName(name));
    authService.getUsername.subscribe(username => this.changeUsername(username));
    authService.getAdmin.subscribe(admin => this.changeAdmin(admin));
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  private changeFullName(name: string): void {
    this.fullName = name;
  }

  private changeAdmin(admin: boolean): void {
    this.admin = admin;
  }

  private changeUsername(username: string): void {
    this.username = username;
  }
}
