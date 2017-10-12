import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  title = 'GPLS Care Tracker';
  isLoggedIn$: Observable<boolean>;

  private usernameSub: any;
  username: string;

  private fullNameSub: any;
  fullName: string;

  private adminSub: any;
  admin: boolean;

  constructor(private authService: AuthenticationService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.fullName = currentUser && currentUser.firstname + ' ' + currentUser.lastname;
    this.username = currentUser && currentUser.username;
    this.admin = currentUser && currentUser.admin;
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;

    this.fullNameSub = this.authService.getLoggedInName.subscribe(name => this.changeFullName(name));
    this.usernameSub = this.authService.getUsername.subscribe(username => this.changeUsername(username));
    this.adminSub = this.authService.getAdmin.subscribe(admin => this.changeAdmin(admin));
  }

  ngOnDestroy() {
    this.fullNameSub.unsubscribe();
    this.usernameSub.unsubscribe();
    this.adminSub.unsubscribe();
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
