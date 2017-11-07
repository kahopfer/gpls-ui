import {Component, OnInit} from '@angular/core';
import {Status} from "../error-alert/error-alert.component";
import {Guardian} from "../../models/guardian";
import {Student} from "../../models/student";
import {GuardianService} from "../../service/guardian.service";
import {StudentService} from "../../service/student.service";
import {ActivatedRoute} from "@angular/router";
import {Invoice} from "../../models/invoice";
import {InvoiceService} from "../../service/invoice.service";
import {ConfirmationService} from "primeng/primeng";

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {

  students: Student[] = [];
  guardians: Guardian[] = [];

  studentsStatus: Status;
  guardiansStatus: Status;
  invoiceStatus: Status;

  invoices: Invoice[] = [];
  selectedInvoice: Invoice;

  paidOptions: any[] = [];

  invoicesLoading: boolean = true;
  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;

  constructor(private studentService: StudentService, private guardianService: GuardianService,
              private route: ActivatedRoute, private invoiceService: InvoiceService,
              private confirmationService: ConfirmationService) {
    this.guardiansStatus = {
      success: null,
      message: null
    };

    this.studentsStatus = {
      success: null,
      message: null
    };

    this.invoiceStatus = {
      success: null,
      message: null
    };

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
  }

  ngOnInit() {
    this.getStudents(this.route.snapshot.params['id']);
    this.getGuardians(this.route.snapshot.params['id']);
    this.getInvoices(this.route.snapshot.params['id']);
  }

  getStudents(familyUnitID: string) {
    this.studentsLoading = true;
    this.studentService.getStudents(familyUnitID).then(students => {
      this.students = students['students'];
      this.studentsStatus.success = true;
      this.studentsLoading = false;
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
      this.studentsLoading = false;
    });
  }

  getGuardians(familyUnitID: string) {
    this.guardiansLoading = true;
    this.guardianService.getGuardians(familyUnitID).then(guardians => {
      this.guardians = guardians['guardians'];
      this.guardiansStatus.success = true;
      this.guardiansLoading = false;
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
      this.guardiansLoading = false;
    });
  }

  getInvoices(familyUnitID: string) {
    this.invoicesLoading = true;

    this.invoiceService.getInvoicesByFamily(familyUnitID).then(invoices => {
      this.invoices = invoices['invoices'];
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
      this.getInvoices(this.route.snapshot.params['id']);
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
        this.getInvoices(this.route.snapshot.params['id']);
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
