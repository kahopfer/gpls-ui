import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Family} from "../../models/family";
import {FamilyService} from "../../service/family.service";
import {Invoice} from "../../models/invoice";
import {InvoiceService} from "../../service/invoice.service";
import {LineItemService} from "../../service/lineItem.service";
import {ConfirmationService, Message} from "primeng/primeng";

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css']
})
export class CreateInvoiceComponent implements OnInit {

  families: Family[] = [];
  loading: boolean = true;
  order: string = 'familyName';
  invoiceRange: Date;
  msgs: Message[] = [];

  constructor(private familyService: FamilyService, private router: Router, private invoiceService: InvoiceService,
              private lineItemService: LineItemService, private confirmationService: ConfirmationService) {
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

  confirmCreateInvoices() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to create invoices for all families?',
      header: 'Create Invoice Confirmation',
      icon: 'fa fa-check',
      accept: () => {
        this.createInvoices();
      }
    })
  }

  createInvoices() {
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
          this.msgs.push({severity: 'success', summary: 'Success Message', detail: 'Invoices successfully created'});
        }).catch(err => {
          if (err.error instanceof Error) {
            console.log('An error occurred:', err.error.message);
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'An error occurred while creating the invoice'
            });
          }
        })
      } else {
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'There are no uninvoiced line items within the selected range'
        });
      }
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while retrieving the line items'
        });
      }
    })
  }

  onRowSelect(event) {
    this.router.navigate(['create-invoice-details', event.data._id]);
  }
}
