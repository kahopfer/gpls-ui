import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-invoice-details',
  templateUrl: './create-invoice-details.component.html',
  styleUrls: ['./create-invoice-details.component.css']
})
export class CreateInvoiceDetailsComponent implements OnInit {

  students: any[];
  guardians: any[];
  lineItems: any[];
  selectedLineItem: any;
  invoiceRange: Date;

  constructor(private location: Location) { }

  ngOnInit() {
    this.guardians = [
      {
        firstName: 'Bill',
        lastName: 'Smith'
      },
      {
        firstName: 'Sandy',
        lastName: 'Smith'
      }
    ];
    this.students = [
      {
        firstName: 'Joey',
        lastName: 'Smith'
      }
    ];
    this.lineItems = [
      {
        id: 1,
        checkIn: new Date("October 9, 2017 15:30:00"),
        checkOut: new Date("October 9, 2017 17:00:00"),
        lineCost: 8.90
      },
      {
        id: 2,
        checkIn: new Date("October 10, 2017 15:30:00"),
        checkOut: new Date("October 10, 2017 17:00:00"),
        lineCost: 8.90
      }
    ]
  }

  goBack() {
    this.location.back();
  }

}
