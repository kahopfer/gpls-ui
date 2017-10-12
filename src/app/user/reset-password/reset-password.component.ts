import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../service/user.service";
import {Status} from "../../error-alert/error-alert.component";
import * as CryptoJS from 'crypto-js';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  username: string;
  newPassword: string;
  private usernameSub: any;
  resetPasswordStatus: Status;

  constructor(private usersService: UserService, private route: ActivatedRoute) {
    this.resetPasswordStatus = {
      success: null,
      message: null
    }
  }

  ngOnInit() {
    this.usernameSub = this.route.params.subscribe(params => {
      this.username = params['username'];
    })
  }

  ngOnDestroy() {
    this.usernameSub.unsubscribe();
  }

  resetPassword(resetPasswordForm: NgForm): void {
    const key = CryptoJS.enc.Base64.parse("#base64Key#");
    const iv = CryptoJS.enc.Base64.parse("#base64IV#");
    const encryptedPasswordNew = CryptoJS.AES.encrypt(this.newPassword, key, {iv: iv});

    this.usersService.resetPassword(this.username, encryptedPasswordNew.toString()).then(() => {
      this.resetPasswordStatus.success = true;
      this.resetPasswordStatus.message = 'You have successfully reset the password for ' + this.username;
      resetPasswordForm.reset();
    }).catch(err => {
      console.log(err);
      this.resetPasswordStatus.success = false;
      this.resetPasswordStatus.message = 'An error occurred';
    })
  }

}
