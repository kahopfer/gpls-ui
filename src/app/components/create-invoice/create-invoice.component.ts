import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Family} from "../../models/family";
import {Status} from "../error-alert/error-alert.component";
import {FamilyService} from "../../service/family.service";
import {Invoice} from "../../models/invoice";
import {InvoiceService} from "../../service/invoice.service";
import {LineItemService} from "../../service/lineItem.service";

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css']
})
export class CreateInvoiceComponent implements OnInit {

  families: Family[] = [];
  familiesStatus: Status;
  invoiceStatus: Status;
  loading: boolean = true;
  order: string = 'familyName';
  invoiceRange: Date;

  constructor(private familyService: FamilyService, private router: Router, private invoiceService: InvoiceService,
              private lineItemService: LineItemService) {

    this.familiesStatus = {
      success: null,
      message: null
    };

    this.invoiceStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
    this.families = [];
    this.getFamilies();
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

  createInvoice() {
    let getLineItemsPromiseArray: Promise<any>[] = [];
    let invoiceToDate: Date = new Date(this.invoiceRange[1].getFullYear(), this.invoiceRange[1].getMonth(), this.invoiceRange[1].getDate(), 23, 59, 59);
    for (let familyIndex in this.families) {
      getLineItemsPromiseArray.push(this.lineItemService.getLineItemsByRange(this.families[familyIndex]._id, this.invoiceRange[0], invoiceToDate));
    }

    Promise.all(getLineItemsPromiseArray).then(lineitems => {
      let createInvoicesPromiseArray: Promise<any>[] = [];
      for (let lineItemIndex in lineitems) {
        if (lineitems[lineItemIndex]['lineItems'].length > 0) {
          let invoice: Invoice = {
            _id: null,
            familyID: lineitems[lineItemIndex]['lineItems'][0].familyID,
            lineItemsID: null,
            totalCost: 0,
            paid: false,
            invoiceFromDate: this.invoiceRange[0],
            invoiceToDate: invoiceToDate,
            invoiceDate: new Date()
          };
          createInvoicesPromiseArray.push(this.invoiceService.createInvoice(invoice).toPromise());
        }
      }
      if (createInvoicesPromiseArray.length > 0) {
        Promise.all(createInvoicesPromiseArray).then(() => {
          this.invoiceStatus.success = true;
          this.invoiceStatus.message = 'Invoices successfully created';
        }).catch(err => {
          if (err.error instanceof Error) {
            console.log('An error occurred:', err.error.message);
            this.invoiceStatus.success = false;
            this.invoiceStatus.message = 'An unexpected error occurred';
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.invoiceStatus.success = false;
            this.invoiceStatus.message = 'An error occurred while creating the invoice';
          }
        })
      } else {
        this.invoiceStatus.success = false;
        this.invoiceStatus.message = 'There are no uninvoiced line items within the selected range.'
      }
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.invoiceStatus.success = false;
        this.invoiceStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.invoiceStatus.success = false;
        this.invoiceStatus.message = 'An error occurred while retrieving the line items';
      }
    })
  }

  onRowSelect(event) {
    this.router.navigate(['create-invoice-details', event.data._id]);
  }
}
