import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "../service/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {
  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  canActivate() {
    this.isLoggedIn$ = this.authService.isLoggedIn;

    if (localStorage.getItem('currentUser') && this.isLoggedIn$) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    return false;
  }
}
