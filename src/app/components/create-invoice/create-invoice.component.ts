import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css']
})
export class CreateInvoiceComponent implements OnInit {

  families: any[];

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.families = [
      {
        familyName: 'Smith'
      },
      {
        familyName: 'Redmond'
      },
      {
        familyName: 'Jones'
      },
      {
        familyName: 'Seashell'
      }
    ]
  }

  onRowSelect(event) {
    this.router.navigate(['create-invoice-details']);
  }

}
