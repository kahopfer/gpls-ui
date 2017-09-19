import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from "../service/authentication.service";
import * as CryptoJS from 'crypto-js';


@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';
  encryptedPassword: any;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    // reset login status
    this.authenticationService.logout();
  }

  ngOnInit() {

  }

  login() {
    this.loading = true;
    let key = CryptoJS.enc.Base64.parse("#base64Key#");
    let iv = CryptoJS.enc.Base64.parse("#base64IV#");
    this.encryptedPassword = CryptoJS.AES.encrypt(this.model.password, key, {iv: iv});

    this.authenticationService.login(this.model.username, this.encryptedPassword.toString())
      .subscribe(result => {
        if (result === true) {
          // login successful
          this.router.navigate(['/']);
        } else {
          // login failed
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }
      }, err => {
        if (err.status === 401) {
          this.error = 'Username or password is incorrect';
          this.loading = false;
        } else {
          console.log(err);
          this.error = 'An unexpected error occurred.';
          this.loading = false;
        }
      });
  }
}
