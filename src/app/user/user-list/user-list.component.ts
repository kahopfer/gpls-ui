import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {Status} from "../../error-alert/error-alert.component";
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
  selectedUsers: User[];
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
    }).catch(err => {
      this.usersStatus.success = false;
      this.usersStatus.message = err;
    });
    this.loading = false;
  }

  goToCreateUserForm() {
    this.router.navigate(['/create-user']);
  }
}
