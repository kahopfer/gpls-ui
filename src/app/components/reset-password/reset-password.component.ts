import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../service/user.service";
import * as CryptoJS from 'crypto-js';
import {NgForm} from "@angular/forms";
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  username: string;
  newPassword: string;
  private usernameSub: any;
  msgs: Message[] = [];

  constructor(private usersService: UserService, private route: ActivatedRoute) {
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
      this.msgs.push({
        severity: 'success',
        summary: 'Success Message',
        detail: 'You have successfully reset the password for ' + this.username
      });
      resetPasswordForm.reset();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        try {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
        } catch (e) {
          if (err.status === 401) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Unauthorized. Please try logging out and logging back in again.'
            });
          } else {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
          }
        }
      }
    })
  }
}
