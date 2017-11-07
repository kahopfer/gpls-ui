import {Component, OnInit} from '@angular/core';
import {Invoice} from "../../models/invoice";
import {InvoiceService} from "../../service/invoice.service";
import {Status} from "../error-alert/error-alert.component";
import {FamilyService} from "../../service/family.service";
import {ConfirmationService} from "primeng/primeng";

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  invoices: Invoice[] = [];
  invoicesToDisplay: any[] = [];
  selectedInvoice: Invoice;
  paidOptions: any[] = [];
  invoicesLoading: boolean = true;
  order: string = 'familyName';

  invoiceStatus: Status;

  constructor(private invoiceService: InvoiceService, private familyService: FamilyService, private confirmationService: ConfirmationService) {
    this.invoiceStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
    this.paidOptions = [{
      label: "All",
      value: null
    }, {
      label: "True",
      value: "true"
    }, {
      label: "False",
      value: "false"
    }];

    this.getInvoices();
  }

  getInvoices() {
    this.invoicesLoading = true;

    let familyNamePromiseArray: Promise<any>[] = [];

    this.invoiceService.getInvoices().then(invoices => {
      this.invoices = invoices['invoices'];

      for (let invoiceIndex in this.invoices) {
        familyNamePromiseArray.push(this.familyService.getFamily(this.invoices[invoiceIndex].familyID));
      }
      Promise.all(familyNamePromiseArray).then(families => {
        this.invoicesToDisplay = this.invoices;
        for (let familyIndex in families) {
          this.invoicesToDisplay[familyIndex].familyName = families[familyIndex]['familyName'];
        }
        this.invoiceStatus.success = true;
        this.invoicesLoading = false;
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.invoiceStatus.success = false;
          this.invoiceStatus.message = 'An unexpected error occurred';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.invoiceStatus.success = false;
          this.invoiceStatus.message = 'An error occurred while loading the family names for the invoices';
        }
        this.invoicesLoading = false;
      })
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.invoiceStatus.success = false;
        this.invoiceStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.invoiceStatus.success = false;
        this.invoiceStatus.message = 'An error occurred while loading the invoices';
      }
      this.invoicesLoading = false;
    })
  }

  deleteInvoice(id: string) {
    this.invoicesLoading = true;
    this.invoiceService.deleteInvoice(id).then(() => {
      this.invoiceStatus.success = true;
      this.invoicesLoading = false;
      this.getInvoices();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.invoiceStatus.success = false;
        this.invoiceStatus.message = 'An unexpected error occurred';
      } else {
        if (err.status === 400) {
          this.invoiceStatus.success = false;
          this.invoiceStatus.message = 'You cannot delete an unpaid invoice'
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.invoiceStatus.success = false;
          this.invoiceStatus.message = 'An error occurred while deleting the invoice';
        }
      }
      this.invoicesLoading = false;
    })
  }

  confirmDeleteInvoice(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this invoice?',
      header: 'Delete Invoice Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteInvoice(id);
      }
    })
  }

  markAsPaid(invoice: Invoice) {
    this.invoicesLoading = true;
    this.invoiceService.getInvoice(invoice._id).then(invoice1 => {
      invoice1['paid'] = true;
      this.invoiceService.updateInvoice(invoice1).then(() => {
        this.invoiceStatus.success = true;
        this.invoicesLoading = false;
        this.getInvoices();
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.invoiceStatus.success = false;
          this.invoiceStatus.message = 'An unexpected error occurred';
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.invoiceStatus.success = false;
          this.invoiceStatus.message = 'An error occurred while updating the invoice';
        }
        this.invoicesLoading = false;
      })
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.invoiceStatus.success = false;
        this.invoiceStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.invoiceStatus.success = false;
        this.invoiceStatus.message = 'An error occurred while getting the invoice';
      }
      this.invoicesLoading = false;
    })

  }
}
