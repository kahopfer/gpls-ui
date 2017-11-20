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
  loading: boolean = true;
  order: string = 'familyName';
  msgs: Message[] = [];

  constructor(private familyService: FamilyService, private router: Router) {
  }

  ngOnInit() {
    this.families = [];
    this.getFamilies();
  }

  getFamilies(): void {
    this.loading = true;
    this.familyService.getFamilies().then(families => {
      this.families = families['families'];
      this.loading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while getting the list of families'
        });
      }
      this.loading = false;
    });
  }

  onRowSelect(event) {
    this.router.navigate(['invoices/list', event.data._id]);
  }
}
