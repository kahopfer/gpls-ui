import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Location} from '@angular/common';
import * as CryptoJS from 'crypto-js';
import {User} from "../../models/user";
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  username: string;
  password: string;
  encryptedPassword: string;
  firstname: string;
  lastname: string;
  admin: boolean;
  msgs: Message[] = [];

  constructor(private userService: UserService, private location: Location) {
  }

  ngOnInit() {
  }

  createUser() {
    let key = CryptoJS.enc.Base64.parse("#base64Key#");
    let iv = CryptoJS.enc.Base64.parse("#base64IV#");
    this.encryptedPassword = CryptoJS.AES.encrypt(this.password, key, {iv: iv});

    let userToCreate: User = {
      username: this.username,
      password: this.encryptedPassword.toString(),
      firstname: this.firstname,
      lastname: this.lastname,
      authorities: null
    };

    if (this.admin) {
      userToCreate.authorities = [
        'ROLE_USER',
        'ROLE_ADMIN'
      ]
    } else {
      userToCreate.authorities = [
        'ROLE_USER'
      ]
    }

    this.userService.createUser(userToCreate).then(() => {
      // this.router.navigate(['/users']);
      this.location.back();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        if (err.status === 409) {
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'A user already exists with that username'
          });
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while creating this user'
          });
        }
      }
    })
  }

  cancel() {
    this.location.back();
  }
}
