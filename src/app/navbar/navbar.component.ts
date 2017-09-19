import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = 'GPLS Before/After Care';
  isLoggedIn$: Observable<boolean>;
  username: string;

  constructor(private authService: AuthenticationService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser && currentUser.firstname + ' ' + currentUser.lastname;
    authService.getLoggedInName.subscribe(name => this.changeName(name));
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  private changeName(name: string): void {
    this.username = name;
  }
}
