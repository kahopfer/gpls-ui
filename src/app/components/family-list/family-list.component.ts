import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Status} from "../error-alert/error-alert.component";
import {Family} from "../../models/family";
import {FamilyService} from "../../service/family.service";
import {ObjectID} from 'bson';
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.css']
})
export class FamilyListComponent implements OnInit, OnDestroy {

  families: Family[] = [];
  familiesStatus: Status;
  loading: boolean = true;
  private adminSub: any;
  admin: boolean;
  order: string = 'familyName';

  constructor(private familyService: FamilyService, private authService: AuthenticationService, private router: Router) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin = currentUser && currentUser.admin;

    this.familiesStatus = {
      success: null,
      message: null
    };
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
    this.router.navigate(['family-details', event.data._id]);
  }

  goToEnrollFamilyForm() {
    this.router.navigate(['/enroll-family']);
  }

  private changeAdmin(admin: boolean): void {
    this.admin = admin;
  }

}
