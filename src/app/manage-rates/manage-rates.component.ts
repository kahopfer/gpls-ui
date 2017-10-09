import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-manage-rates',
  templateUrl: './manage-rates.component.html',
  styleUrls: ['./manage-rates.component.css']
})
export class ManageRatesComponent implements OnInit {

  admin: boolean;
  rates: any[];

  constructor(private authService: AuthenticationService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin = currentUser && currentUser.admin;
    authService.getAdmin.subscribe(admin => this.changeAdmin(admin));
  }

  ngOnInit() {
    this.rates = [{
      name: 'Before Care Full Week',
      value: 31.00,
      extra: false
    }, {
      name: 'Before Care Full Morning',
      value: 6.60,
      extra: false
    }, {
      name: 'Before Care Hour or Less',
      value: 3.90,
      extra: false
    }, {
      name: 'After Care Full Week',
      value: 40.00,
      extra: false
    }, {
      name: 'After Care Full Afternoon',
      value: 8.90,
      extra: false
    }, {
      name: 'After Care Hour or Less',
      value: 4.45,
      extra: false
    }, {
      name: 'Early In Late Out',
      value: 1.25,
      extra: false
    }, {
      name: 'Breakfast',
      value: 1.25,
      extra: true
    }]
  }

  private changeAdmin(admin: boolean): void {
    this.admin = admin;
  }

  saveChanges() {
    console.log('Changes saved!');
  }

}
