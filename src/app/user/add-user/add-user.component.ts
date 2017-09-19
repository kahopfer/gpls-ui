import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../service/users.service";
import {Router} from "@angular/router";
import {Status} from "../../error-alert/error-alert.component";
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
  admin: string;

  constructor(private userService: UsersService, private router: Router) {
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
      this.router.navigate(['/users']);
    }).catch(err => {
      this.createUserStatus.success = false;
      this.createUserStatus.message = err;
    })

  }

}
