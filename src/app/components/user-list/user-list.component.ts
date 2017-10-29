import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {Status} from "../error-alert/error-alert.component";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  usersStatus: Status;
  selectedUser: User;
  loading: boolean = true;

  constructor(private usersService: UserService, private router: Router) {
    this.usersStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
    this.users = [];
    this.getUsers();
  }

  getUsers(): void {
    this.loading = true;
    this.usersService.getUsers().then(users => {
      this.users = users.json().users;
      this.usersStatus.success = true;
      this.loading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.usersStatus.success = false;
        this.usersStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.usersStatus.success = false;
        this.usersStatus.message = 'An error occurred while getting the list of users';
      }
      this.loading = false;
    });
  }

  deleteSelectedUser(username: string): void {
    this.usersService.deleteUser(username).then(() => {
      this.usersStatus.success = true;
      this.getUsers();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.usersStatus.success = false;
        this.usersStatus.message = 'An unexpected error occurred';
      } else {
        if (err.status === 400) {
          this.usersStatus.success = false;
          this.usersStatus.message = 'You cannot delete yourself from the system';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.usersStatus.success = false;
          this.usersStatus.message = 'An error occurred while deleting the user ' + username;
        }
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
