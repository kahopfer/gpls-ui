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
import {UserService} from "../../service/user.service";
import {User} from "../../models/user";
import {PriceList} from "../../models/priceList";
import {PriceListService} from "../../service/priceList.service";

@Component({
  selector: 'app-create-invoice-details',
  templateUrl: './create-invoice-details.component.html',
  styleUrls: ['./create-invoice-details.component.css']
})
export class CreateInvoiceDetailsComponent implements OnInit {

  students: Student[];
  guardians: Guardian[];
  lineItems: LineItem[];
  lineItemsToDisplay: any[];
  users: User[];
  extraItems: PriceList[];

  selectedLineItem: LineItem;
  lineItem: LineItem = new LineItem();

  invoiceRange: Date;

  studentsStatus: Status;
  guardiansStatus: Status;
  lineItemsStatus: Status;
  lineItemStatus: Status;

  newLineItem: boolean;
  displayLineItemDialog: boolean;

  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;
  lineItemsLoading: boolean = true;

  constructor(private location: Location, private studentService: StudentService, private guardianService: GuardianService,
              private lineItemService: LineItemService, private route: ActivatedRoute, private usersService: UserService,
              private priceListService: PriceListService) {
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

    this.lineItemStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
    this.getStudents(this.route.snapshot.params['id']);
    this.getGuardians(this.route.snapshot.params['id']);
    this.getLineItems(this.route.snapshot.params['id']);
    this.getUsers();
    this.getExtraItems();
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
    // Used to get the students associated to each line item
    let individualStudentPromiseArray: Promise<any>[] = [];

    this.lineItemsLoading = true;
    this.lineItemService.getLineItemsByFamily(familyID).then(lineItems => {
      this.lineItems = lineItems.json().lineItems;

      for (let lineItemIndex in this.lineItems) {
        individualStudentPromiseArray.push(this.studentService.getStudent(this.lineItems[lineItemIndex].studentID));
      }

      Promise.all(individualStudentPromiseArray).then(students => {
        this.lineItemsToDisplay = this.lineItems;
        for (let studentIndex in students) {
          this.lineItemsToDisplay[studentIndex].studentName = JSON.parse(students[studentIndex]._body).fname + ' ' +
            JSON.parse(students[studentIndex]._body).lname;
        }
        this.lineItemsStatus.success = true;
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.lineItemsStatus.success = false;
          this.lineItemsStatus.message = 'An unexpected error occurred';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.lineItemsStatus.success = false;
          this.lineItemsStatus.message = 'An error occurred while loading the student names for the line items';
        }
      });
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

  getUsers(): void {
    this.usersService.getUsers().then(users => {
      this.users = users.json().users;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    });
  }

  getExtraItems(): void {
    this.priceListService.getExtraPriceList().then(priceList => {
      this.extraItems = priceList.json().priceLists;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    });
  }

  deleteLineItem(id: string) {
    this.lineItemService.deleteLineItem(id).then(() => {
      this.lineItemStatus.success = true;
      this.lineItem = null;
      this.displayLineItemDialog = false;
      this.getLineItems(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.lineItemStatus.success = false;
        this.lineItemStatus.message = 'An unexpected error occurred';
      } else {
        if (err.status === 404) {
          this.lineItemStatus.success = false;
          this.lineItemStatus.message = 'Student not found';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.lineItemStatus.success = false;
          this.lineItemStatus.message = 'An error occurred while deleting the line item';
        }
      }
    })
  }

  saveLineItem(lineItem: LineItem) {
    // If the lineItem is not new, then update the selected lineItem
    if (this.newLineItem === false) {
      if (!this.lineItem.extraItem) {
        this.lineItem.serviceType = this.lineItemService.determineServiceType(this.lineItem.checkIn, this.lineItem.checkOut);
      }
      this.lineItemService.updateLineItem(lineItem).then(() => {
        this.lineItemStatus.success = true;
        this.lineItem = null;
        this.displayLineItemDialog = false;
        this.getLineItems(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.lineItemStatus.success = false;
          this.lineItemStatus.message = 'An unexpected error occurred';
        } else {
          if (err.status === 400) {
            this.lineItemStatus.success = false;
            this.lineItemStatus.message = 'Check in time must be earlier than check out time';
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.lineItemStatus.success = false;
            this.lineItemStatus.message = 'An error occurred while updating the line item';
          }
        }
      })
    } else {
      if (this.lineItem.extraItem == true) {
        let date: Date = new Date();
        this.lineItem.checkIn = date;
        this.lineItem.checkOut = date;
        this.lineItem.checkInBy = 'Other';
        this.lineItem.checkOutBy = 'Other';
      } else {
        this.lineItem.serviceType = this.lineItemService.determineServiceType(this.lineItem.checkIn, this.lineItem.checkOut);
      }

      this.lineItemService.createLineItem(this.route.snapshot.params['id'], this.lineItem.studentID, this.lineItem.extraItem, this.lineItem.checkIn,
        this.lineItem.checkOut, this.lineItem.serviceType, 0.00, 0.00,
        this.lineItem.checkInBy, this.lineItem.checkOutBy, this.lineItem.notes, this.lineItem.invoiceID).subscribe(() => {
        this.lineItemStatus.success = true;
        this.lineItem = null;
        this.displayLineItemDialog = false;
        this.getLineItems(this.route.snapshot.params['id']);
      }, err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.lineItemStatus.success = false;
          this.lineItemStatus.message = 'An unexpected error occurred';
        } else {
          if (err.status === 400) {
            this.lineItemStatus.success = false;
            this.lineItemStatus.message = 'Check in time must be earlier than check out time';
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.lineItemStatus.success = false;
            this.lineItemStatus.message = 'An error occurred creating the line item';
          }
        }
      })
    }
  }

  onLineItemSelect(event) {
    this.newLineItem = false;
    this.lineItemService.getLineItem(event.data._id).then(lineItem => {
      this.lineItem = JSON.parse(lineItem._body);
      this.lineItem.checkIn = new Date(JSON.parse(lineItem._body).checkIn);
      this.lineItem.checkOut = new Date(JSON.parse(lineItem._body).checkOut);
      this.displayLineItemDialog = true;
      this.lineItemStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.lineItemStatus.success = false;
        this.lineItemStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.lineItemStatus.success = false;
        this.lineItemStatus.message = 'An error occurred while loading the line item';
      }
    });
    this.displayLineItemDialog = true;
  }

  showDialogToAddLineItem() {
    this.newLineItem = true;
    this.lineItem = new LineItem();
    this.lineItem.extraItem = false;
    this.displayLineItemDialog = true;
  }

  goBack() {
    this.location.back();
  }
}
