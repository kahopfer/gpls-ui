import {Component, OnInit} from '@angular/core';
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
import {InvoiceService} from "../../service/invoice.service";
import {Invoice} from "../../models/invoice";
import {ConfirmationService, Message} from "primeng/primeng";

@Component({
  selector: 'app-create-invoice-details',
  templateUrl: './create-invoice-details.component.html',
  styleUrls: ['./create-invoice-details.component.css']
})
export class CreateInvoiceDetailsComponent implements OnInit {

  students: Student[] = [];
  guardians: Guardian[] = [];
  lineItems: LineItem[] = [];
  lineItemsToDisplay: any[] = [];
  users: User[] = [];
  extraItems: PriceList[] = [];

  selectedLineItem: LineItem;
  lineItem: LineItem = new LineItem();

  invoiceRange: Date;

  newLineItem: boolean;
  displayLineItemDialog: boolean;

  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;
  lineItemsLoading: boolean = true;

  msgs: Message[] = [];

  constructor(private studentService: StudentService, private guardianService: GuardianService,
              private lineItemService: LineItemService, private route: ActivatedRoute, private usersService: UserService,
              private priceListService: PriceListService, private invoiceService: InvoiceService,
              private confirmationService: ConfirmationService) {
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
      this.students = students['students'];
      this.studentsLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the students'
        });
      }
      this.studentsLoading = false;
    });
  }

  getGuardians(familyUnitID: string) {
    this.guardiansLoading = true;
    this.guardianService.getGuardians(familyUnitID).then(guardians => {
      this.guardians = guardians['guardians'];
      this.guardiansLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the guardians'
        });
      }
      this.guardiansLoading = false;
    });
  }

  getLineItems(familyID: string) {
    // Used to get the students associated to each line item
    let individualStudentPromiseArray: Promise<any>[] = [];

    this.lineItemsLoading = true;
    this.lineItemService.getLineItemsByFamily(familyID).then(lineItems => {
      this.lineItems = lineItems['lineItems'];

      for (let lineItemIndex in this.lineItems) {
        individualStudentPromiseArray.push(this.studentService.getStudent(this.lineItems[lineItemIndex].studentID));
      }

      Promise.all(individualStudentPromiseArray).then(students => {
        this.lineItemsToDisplay = this.lineItems;
        for (let studentIndex in students) {
          this.lineItemsToDisplay[studentIndex].studentName = students[studentIndex]['fname'] + ' ' +
            students[studentIndex]['lname'];
        }
        this.lineItemsLoading = false;
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while loading the student names for the line items'
          });
        }
        this.lineItemsLoading = false;
      });
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the line items'
        });
      }
      this.lineItemsLoading = false;
    });
  }

  getUsers(): void {
    this.usersService.getUsers().then(users => {
      this.users = users['users'];
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the system users'
        });
      }
    });
  }

  getExtraItems(): void {
    this.priceListService.getExtraPriceList().then(priceList => {
      this.extraItems = priceList['priceLists'];
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the child care rates'
        });
      }
    });
  }

  deleteLineItem(id: string) {
    this.lineItemService.deleteLineItem(id).then(() => {
      this.lineItem = null;
      this.displayLineItemDialog = false;
      this.getLineItems(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        if (err.status === 404) {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'Student not found'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while deleting the line item'
          });
        }
      }
    })
  }

  confirmDeleteLineItem(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this line item?',
      header: 'Delete Line Item Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteLineItem(id);
      }
    })
  }

  saveLineItem(lineItem: LineItem) {
    // If the lineItem is not new, then update the selected lineItem
    if (this.newLineItem === false) {
      if (!this.lineItem.extraItem) {
        // this.lineItem.serviceType = LineItemService.determineServiceType(this.lineItem.checkIn, this.lineItem.checkOut);
        this.lineItem.serviceType = 'Child Care';
      }
      this.lineItemService.updateLineItem(lineItem).then(() => {
        this.lineItem = null;
        this.displayLineItemDialog = false;
        this.getLineItems(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          if (err.status === 400) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Check in time must be earlier than check out time'
            });
          }
          if (err.status === 409) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Time is overlapping with existing time'
            });
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred while updating the line item'
            });
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
        // this.lineItem.serviceType = LineItemService.determineServiceType(this.lineItem.checkIn, this.lineItem.checkOut);
        this.lineItem.serviceType = 'Child Care';
      }

      this.lineItem.familyID = this.route.snapshot.params['id'];
      this.lineItem.earlyInLateOutFee = 0;
      this.lineItem.lineTotalCost = 0;

      this.lineItemService.createLineItem(this.lineItem).subscribe(() => {
        this.lineItem = null;
        this.displayLineItemDialog = false;
        this.getLineItems(this.route.snapshot.params['id']);
      }, err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          if (err.status === 400) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Check in time must be earlier than check out time'
            });
          } else if (err.status === 409) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Time is overlapping with existing time'
            });
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred creating the line item'
            });
          }
        }
      })
    }
  }

  onLineItemSelect(event) {
    this.newLineItem = false;
    this.lineItemService.getLineItem(event.data._id).then(lineItem => {
      this.lineItem = lineItem;
      this.lineItem.checkIn = new Date(lineItem['checkIn']);
      this.lineItem.checkOut = new Date(lineItem['checkOut']);
      this.displayLineItemDialog = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the line item'
        });
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

  confirmCreateInvoice() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to create an invoice for this family?',
      header: 'Create Invoice Confirmation',
      icon: 'fa fa-check',
      accept: () => {
        this.createInvoice();
      }
    })
  }

  createInvoice() {
    let invoiceToDate: Date = new Date(this.invoiceRange[1].getFullYear(), this.invoiceRange[1].getMonth(), this.invoiceRange[1].getDate(), 23, 59, 59);
    let invoice: Invoice = {
      _id: null,
      familyID: this.route.snapshot.params['id'],
      lineItemsID: null,
      totalCost: 0,
      paid: false,
      invoiceFromDate: this.invoiceRange[0],
      invoiceToDate: invoiceToDate,
      invoiceDate: new Date()
    };

    this.invoiceService.createInvoice(invoice).subscribe(() => {
      this.getLineItems(this.route.snapshot.params['id']);
    }, err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        if (err.status === 400) {
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'There are no uninvoiced line items within the selected range'
          });
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while creating the invoice'
          });
        }
      }
    })
  }
}
