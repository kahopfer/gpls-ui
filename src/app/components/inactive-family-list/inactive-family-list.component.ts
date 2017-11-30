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

  onRowSelect(event) {
    this.router.navigate(['inactive-family-details', event.data._id]);
  }
}
