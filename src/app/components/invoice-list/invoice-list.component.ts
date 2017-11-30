import {Component, OnInit} from '@angular/core';
import {Family} from "../../models/family";
import {FamilyService} from "../../service/family.service";
import {Router} from "@angular/router";
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  families: Family[] = [];
  inactiveFamilies: Family[] = [];
  loading: boolean = true;
  inactiveFamiliesLoading: boolean = true;
  order: string = 'familyName';
  msgs: Message[] = [];

  constructor(private familyService: FamilyService, private router: Router) {
  }

  ngOnInit() {
    this.families = [];
    this.getFamilies();
    this.getInactiveFamilies();
  }

  getFamilies(): void {
    this.loading = true;
    this.familyService.getFamilies().then(families => {
      this.families = families['data']['families'];
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

  getInactiveFamilies(): void {
    this.inactiveFamiliesLoading = true;
    this.familyService.getInactiveFamilies().then(families => {
      this.inactiveFamilies = families['data']['families'];
      this.inactiveFamiliesLoading = false;
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
      this.inactiveFamiliesLoading = false;
    });
  }

  onRowSelect(event) {
    this.router.navigate(['invoices/list', event.data._id]);
  }
}
