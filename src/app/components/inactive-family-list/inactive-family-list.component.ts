import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Family} from "../../models/family";
import {FamilyService} from "../../service/family.service";
import {ObjectID} from 'bson';
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-inactive-family-list',
  templateUrl: './inactive-family-list.component.html',
  styleUrls: ['./inactive-family-list.component.css']
})
export class InactiveFamilyListComponent implements OnInit {

  families: Family[] = [];
  loading: boolean = true;
  admin: boolean;
  order: string = 'familyName';
  msgs: Message[] = [];

  constructor(private familyService: FamilyService, private router: Router) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin = currentUser && currentUser.admin;
  }

  ngOnInit() {
    this.families = [];
    this.getFamilies();
  }

  getFamilies(): void {
    this.loading = true;
    this.familyService.getInactiveFamilies().then(families => {
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
    this.router.navigate(['inactive-family-details', event.data._id]);
  }
}
