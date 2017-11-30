import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {ConfirmationService, Message} from "primeng/primeng";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  selectedUser: User;
  loading: boolean = true;
  msgs: Message[] = [];

  constructor(private usersService: UserService, private router: Router, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.users = [];
    this.getUsers();
  }

  getUsers(): void {
    this.loading = true;
    this.usersService.getUsers().then(users => {
      this.users = users['data']['users'];
      this.loading = false;
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
      this.loading = false;
    });
  }

  deleteSelectedUser(username: string): void {
    this.usersService.deleteUser(username).then(() => {
      this.selectedUser = null;
      this.getUsers();
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

  confirmDeleteUser(username: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete User Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteSelectedUser(username);
      }
    })
  }

  goToResetPasswordForm(username: string) {
    this.router.navigate(['/reset-password', username]);
  }

  goToCreateUserForm() {
    this.router.navigate(['/create-user']);
  }
}
