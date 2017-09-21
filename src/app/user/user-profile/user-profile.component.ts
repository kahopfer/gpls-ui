import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {UserService} from "../../service/user.service";
import {Status} from "../../error-alert/error-alert.component";

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
  admin: boolean;

  constructor(private userService: UserService) {
    this.changePasswordStatus = {
      success: null,
      message: null
    };
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser && currentUser.username;
    this.firstname = currentUser && currentUser.firstname;
    this.lastname = currentUser && currentUser.lastname;
    this.admin = currentUser && currentUser.admin;
  }

  ngOnInit() {
  }

  //TODO: Improve password update function
  changePassword(): void {
    const key = CryptoJS.enc.Base64.parse("#base64Key#");
    const iv = CryptoJS.enc.Base64.parse("#base64IV#");
    const encryptedPasswordOld = CryptoJS.AES.encrypt(this.oldPassword, key, {iv: iv});
    const encryptedPasswordNew = CryptoJS.AES.encrypt(this.newPassword, key, {iv: iv});

    this.userService.changePassword(encodeURI(encryptedPasswordOld.toString()), encryptedPasswordNew.toString()).then(() => {
      this.changePasswordStatus.success = true;
    }).catch(err => {
      this.changePasswordStatus.success = false;
      this.changePasswordStatus.message = err;
    })
  }
}
