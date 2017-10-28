import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {Location} from '@angular/common';
import {Status} from "../error-alert/error-alert.component";
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  createUserStatus: Status;
  username: string;
  password: string;
  encryptedPassword: string;
  firstname: string;
  lastname: string;
  admin: boolean;

  constructor(private userService: UserService, private router: Router, private location: Location) {
    this.createUserStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
  }

  createUser() {
    let key = CryptoJS.enc.Base64.parse("#base64Key#");
    let iv = CryptoJS.enc.Base64.parse("#base64IV#");
    this.encryptedPassword = CryptoJS.AES.encrypt(this.password, key, {iv: iv});

    this.userService.createUser(this.username, this.encryptedPassword.toString(), this.firstname, this.lastname, this.admin).then(() => {
      this.createUserStatus.success = true;
      // this.router.navigate(['/users']);
      this.location.back();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.createUserStatus.success = false;
        this.createUserStatus.message = 'An unexpected error occurred';
      } else {
        if (err.status === 409) {
          this.createUserStatus.success = false;
          this.createUserStatus.message = 'A user already exists with that username';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.createUserStatus.success = false;
          this.createUserStatus.message = 'An error occurred while creating this user';
        }
      }
    })
  }

  cancel() {
    this.location.back();
  }
}
