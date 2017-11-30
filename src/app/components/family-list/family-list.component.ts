import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Family} from "../../models/family";
import {FamilyService} from "../../service/family.service";
import {ObjectID} from 'bson';
import {AuthenticationService} from "../../service/authentication.service";
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.css']
})
export class FamilyListComponent implements OnInit, OnDestroy {

  families: Family[] = [];
  loading: boolean = true;
  private adminSub: any;
  admin: boolean;
  order: string = 'familyName';
  msgs: Message[] = [];

  constructor(private familyService: FamilyService, private authService: AuthenticationService, private router: Router) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin = currentUser && currentUser.admin;
  }

  ngOnInit() {
    this.adminSub = this.authService.getAdmin.subscribe(admin => this.changeAdmin(admin));
    this.families = [];
    this.getFamilies();
  }

  ngOnDestroy() {
    this.adminSub.unsubscribe();
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

  onRowSelect(event) {
    this.router.navigate(['family-details', event.data._id]);
  }

  goToEnrollFamilyForm() {
    this.router.navigate(['/enroll-family']);
  }

  private changeAdmin(admin: boolean): void {
    this.admin = admin;
  }

}
