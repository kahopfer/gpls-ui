import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Status} from "../error-alert/error-alert.component";
import {Student} from "../../models/student";
import {Guardian} from "../../models/guardian";
import {LineItem} from "../../models/lineItem";
import {StudentService} from "../../service/student.service";
import {GuardianService} from "../../service/guardian.service";
import {LineItemService} from "../../service/lineItem.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-create-invoice-details',
  templateUrl: './create-invoice-details.component.html',
  styleUrls: ['./create-invoice-details.component.css']
})
export class CreateInvoiceDetailsComponent implements OnInit {

  students: Student[];
  guardians: Guardian[];
  lineItems: LineItem[];
  selectedLineItem: any;
  invoiceRange: Date;

  studentsStatus: Status;
  guardiansStatus: Status;
  lineItemsStatus: Status;

  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;
  lineItemsLoading: boolean = true;

  constructor(private location: Location, private studentService: StudentService, private guardianService: GuardianService,
              private lineItemService: LineItemService, private route: ActivatedRoute,) {
    this.guardiansStatus = {
      success: null,
      message: null
    };

    this.studentsStatus = {
      success: null,
      message: null
    };

    this.lineItemsStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
    this.getStudents(this.route.snapshot.params['id']);
    this.getGuardians(this.route.snapshot.params['id']);
    this.getLineItems(this.route.snapshot.params['id']);
  }

  getStudents(familyUnitID: string) {
    this.studentsLoading = true;
    this.studentService.getStudents(familyUnitID).then(students => {
      this.students = students.json().students;
      this.studentsStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.studentsStatus.success = false;
        this.studentsStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.studentsStatus.success = false;
        this.studentsStatus.message = 'An error occurred while loading the students';
      }
    });
    this.studentsLoading = false;
  }

  getGuardians(familyUnitID: string) {
    this.guardiansLoading = true;
    this.guardianService.getGuardians(familyUnitID).then(guardians => {
      this.guardians = guardians.json().guardians;
      this.guardiansStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.guardiansStatus.success = false;
        this.guardiansStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.guardiansStatus.success = false;
        this.guardiansStatus.message = 'An error occurred while loading the guardians';
      }
    });
    this.guardiansLoading = false;
  }

  getLineItems(familyID: string) {
    this.lineItemsLoading = true;
    this.lineItemService.getLineItemsByFamily(familyID).then(lineItems => {
      this.lineItems = lineItems.json().lineItems;
      this.lineItemsStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.lineItemsStatus.success = false;
        this.lineItemsStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.lineItemsStatus.success = false;
        this.lineItemsStatus.message = 'An error occurred while loading the line items';
      }
    });
    this.lineItemsLoading = false;
  }

  goBack() {
    this.location.back();
  }

}
