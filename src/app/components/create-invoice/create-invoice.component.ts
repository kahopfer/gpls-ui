import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Family} from "../../models/family";
import {Status} from "../error-alert/error-alert.component";
import {FamilyService} from "../../service/family.service";

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css']
})
export class CreateInvoiceComponent implements OnInit {

  families: Family[] = [];
  familiesStatus: Status;
  loading: boolean = true;
  order: string = 'familyName';

  constructor(private familyService: FamilyService,  private router: Router) {

    this.familiesStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
    this.families = [];
    this.getFamilies();
  }

  getFamilies(): void {
    this.loading = true;
    this.familyService.getFamilies().then(families => {
      this.families = families.json().families;
      this.familiesStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.familiesStatus.success = false;
        this.familiesStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.familiesStatus.success = false;
        this.familiesStatus.message = 'An error occurred while getting the list of families';
      }
    });
    this.loading = false;
  }

  onRowSelect(event) {
    this.router.navigate(['create-invoice-details', event.data._id]);
  }
}
