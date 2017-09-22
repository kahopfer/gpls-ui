import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {UserService} from "../../service/user.service";
import {Status} from "../../error-alert/error-alert.component";
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  changePasswordStatus: Status;
  oldPassword: string;
  newPassword: string;

  constructor(private userService: UserService, private authService: AuthenticationService) {
    this.changePasswordStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
  }

  changePassword(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const key = CryptoJS.enc.Base64.parse("#base64Key#");
    const iv = CryptoJS.enc.Base64.parse("#base64IV#");
    const encryptedPasswordOld = CryptoJS.AES.encrypt(this.oldPassword, key, {iv: iv});
    const encryptedPasswordNew = CryptoJS.AES.encrypt(this.newPassword, key, {iv: iv});

    this.userService.changePassword(encodeURI(encryptedPasswordOld.toString()), encryptedPasswordNew.toString()).then(() => {
      this.authService.login(currentUser.username, encryptedPasswordNew.toString()).subscribe(result => {
        if (result === true) {
          this.changePasswordStatus.success = true;
        } else {
          this.changePasswordStatus.success = false;
          this.changePasswordStatus.message = 'An error occurred while reauthorizing your account';
        }
      }, err => {
        if (err.status === 401) {
          this.changePasswordStatus.success = false;
          this.changePasswordStatus.message = 'An error occurred while reauthorizing your account';
        } else {
          console.log(err);
          this.changePasswordStatus.success = false;
          this.changePasswordStatus.message = 'An unexpected error occurred';
        }
      })

    }).catch(err => {
      this.changePasswordStatus.success = false;
      this.changePasswordStatus.message = err;
    })
  }
}
