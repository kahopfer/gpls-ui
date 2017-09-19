import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Status} from "../error-alert/error-alert.component";
import {Family} from "../models/family";
import {FamilyService} from "../service/family.service";

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.css']
})
export class FamilyListComponent implements OnInit {

  families: Family[] = [];
  familiesStatus: Status;
  selectedFamily: Family;
  loading: boolean = false;

  constructor(private familyService: FamilyService, private router: Router) {
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
    this.loading = false;
    this.familyService.getFamilies().then(families => {
      this.families = families.json().families;
      this.familiesStatus.success = true;
    }).catch(err => {
      this.familiesStatus.success = false;
      this.familiesStatus.message = err;
    });
    this.loading = true;
  }

  onRowSelect(event) {
    this.router.navigate(['family-details', event.data._id]);
  }

}
