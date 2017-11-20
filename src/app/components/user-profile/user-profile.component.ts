import {Component, OnDestroy, OnInit} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {UserService} from "../../service/user.service";
import {AuthenticationService} from "../../service/authentication.service";
import {NgForm} from "@angular/forms";
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private firstNameSub: any;
  firstname: string;

  private lastNameSub: any;
  lastname: string;

  private usernameSub: any;
  username: string;

  oldPassword: string;
  newPassword: string;

  msgs: Message[] = [];

  constructor(private userService: UserService, private authService: AuthenticationService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser && currentUser.username;
    this.firstname = currentUser && currentUser.firstname;
    this.lastname = currentUser && currentUser.lastname;
  }

  ngOnInit() {
    this.firstNameSub = this.authService.getFirstName.subscribe(firstname => this.changeFirstName(firstname));
    this.lastNameSub = this.authService.getLastName.subscribe(lastname => this.changeLastName(lastname));
    this.usernameSub = this.authService.getUsername.subscribe(username => this.changeUsername(username));
  }

  ngOnDestroy() {
    this.firstNameSub.unsubscribe();
    this.lastNameSub.unsubscribe();
    this.usernameSub.unsubscribe();
  }

  changePassword(changePasswordForm: NgForm): void {
    const key = CryptoJS.enc.Base64.parse("#base64Key#");
    const iv = CryptoJS.enc.Base64.parse("#base64IV#");
    const encryptedPasswordOld = CryptoJS.AES.encrypt(this.oldPassword, key, {iv: iv});
    const encryptedPasswordNew = CryptoJS.AES.encrypt(this.newPassword, key, {iv: iv});

    this.userService.changePassword(encodeURI(encryptedPasswordOld.toString()), encryptedPasswordNew.toString()).then(() => {
      this.authService.login(this.username, encryptedPasswordNew.toString()).subscribe(() => {
        this.msgs.push({severity:'success', summary:'Success Message', detail:'You have successfully changed your password'});
        changePasswordForm.resetForm();
      }, err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity:'error', summary:'Error Message', detail:'An unexpected error occurred'});
        } else {
          if (err.status === 401) {
            this.msgs.push({severity:'error', summary:'Error Message', detail:'An error occurred while reauthorizing your account'});
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({severity:'error', summary:'Error Message', detail:'An unexpected server error occurred'});
          }
        }
      })

    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity:'error', summary:'Error Message', detail:'An unexpected error occurred'});
      } else {
        if (err.status === 400) {
          this.msgs.push({severity:'error', summary:'Error Message', detail:'Old password is incorrect'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({severity:'error', summary:'Error Message', detail:'An error occurred while changing your password'});
        }
      }
    })
  }

  private changeFirstName(firstname: string): void {
    this.firstname = firstname;
  }

  private changeLastName(lastname: string): void {
    this.lastname = lastname;
  }

  private changeUsername(username: string): void {
    this.username = username;
  }
}
