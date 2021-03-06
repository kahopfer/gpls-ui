import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {
  admin: boolean;

  constructor(private router: Router) {

  }

  canActivate() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin = currentUser && currentUser.admin;

    if (this.admin) {
      // admin so return true
      return true;
    }

    // not admin so redirect to employees page
    this.router.navigate(['/family-list']);
    return false;
  }
}
