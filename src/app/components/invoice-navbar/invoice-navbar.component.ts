import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/primeng";

@Component({
  selector: 'app-invoice-navbar',
  templateUrl: './invoice-navbar.component.html',
  styleUrls: ['./invoice-navbar.component.css']
})
export class InvoiceNavbarComponent implements OnInit {

  items: MenuItem[];

  constructor() {
  }

  ngOnInit() {
    this.items = [
      {
        label: 'View all Invoices',
        routerLink: 'all'
      },
      {
        label: 'View Invoices by Family',
        routerLink: 'list'
      }
    ];
  }
}
