import {Component, OnInit} from '@angular/core';
import {Family} from "../../models/family";
import {Status} from "../error-alert/error-alert.component";
import {FamilyService} from "../../service/family.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

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
      this.families = families['families'];
      this.familiesStatus.success = true;
      this.loading = false;
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
      this.loading = false;
    });
  }

  onRowSelect(event) {
    this.router.navigate(['invoices/list', event.data._id]);
  }
}
