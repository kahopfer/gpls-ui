import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {UserService} from "../../service/user.service";
import {Status} from "../../error-alert/error-alert.component";
import {AuthenticationService} from "../../service/authentication.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  changePasswordStatus: Status;
  username: string;
  oldPassword: string;
  newPassword: string;
  firstname: string;
  lastname: string;

  constructor(private userService: UserService, private authService: AuthenticationService) {
    this.changePasswordStatus = {
      success: null,
      message: null
    };
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser && currentUser.username;
    this.firstname = currentUser && currentUser.firstname;
    this.lastname = currentUser && currentUser.lastname;
  }

  ngOnInit() {
  }

  changePassword(changePasswordForm: NgForm): void {
    const key = CryptoJS.enc.Base64.parse("#base64Key#");
    const iv = CryptoJS.enc.Base64.parse("#base64IV#");
    const encryptedPasswordOld = CryptoJS.AES.encrypt(this.oldPassword, key, {iv: iv});
    const encryptedPasswordNew = CryptoJS.AES.encrypt(this.newPassword, key, {iv: iv});

    this.userService.changePassword(encodeURI(encryptedPasswordOld.toString()), encryptedPasswordNew.toString()).then(() => {
      this.authService.login(this.username, encryptedPasswordNew.toString()).subscribe(() => {
          this.changePasswordStatus.success = true;
          this.changePasswordStatus.message = 'You have successfully changed your password';
          changePasswordForm.resetForm();
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
      if(err.status === 400) {
        this.changePasswordStatus.success = false;
        this.changePasswordStatus.message = 'Old password is incorrect';
      } else {
        console.log(err);
        this.changePasswordStatus.success = false;
        this.changePasswordStatus.message = 'An unexpected error occurred';
      }
    })
  }
}
