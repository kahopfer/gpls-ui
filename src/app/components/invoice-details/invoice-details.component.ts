import {Component, OnInit} from '@angular/core';
import {Guardian} from "../../models/guardian";
import {Student} from "../../models/student";
import {GuardianService} from "../../service/guardian.service";
import {StudentService} from "../../service/student.service";
import {ActivatedRoute} from "@angular/router";
import {Invoice} from "../../models/invoice";
import {InvoiceService} from "../../service/invoice.service";
import {ConfirmationService, Message} from "primeng/primeng";
import {FamilyService} from "../../service/family.service";
import {Family} from "../../models/family";

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {

  family: Family;
  students: Student[] = [];
  guardians: Guardian[] = [];

  invoices: Invoice[] = [];
  selectedInvoice: Invoice;

  paidOptions: any[] = [];

  invoicesLoading: boolean = true;
  studentsLoading: boolean = true;
  guardiansLoading: boolean = true;

  msgs: Message[] = [];

  constructor(private studentService: StudentService, private guardianService: GuardianService,
              private route: ActivatedRoute, private invoiceService: InvoiceService,
              private confirmationService: ConfirmationService, private familyService: FamilyService) {

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
    this.getStudentsAndGuardians(this.route.snapshot.params['id']);
    this.getInvoices(this.route.snapshot.params['id']);
  }

  // TODO: Decide whether we want ALL students and guardians to show up here or not
  getStudentsAndGuardians(familyUnitID: string) {
    let getStudentsPromiseArray: Promise<Student>[] = [];
    let getGuardiansPromiseArray: Promise<Guardian>[] = [];

    this.familyService.getFamily(familyUnitID).then(family => {
      this.family = family;
      for (let studentIndex in this.family.students) {
        getStudentsPromiseArray.push(this.studentService.getStudent(this.family.students[studentIndex]));
      }
      this.studentsLoading = true;
      Promise.all(getStudentsPromiseArray).then(students => {
        this.students = students;
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
      for (let guardianIndex in this.family.guardians) {
        getGuardiansPromiseArray.push(this.guardianService.getGuardian(this.family.guardians[guardianIndex]));
      }
      this.guardiansLoading = true;
      Promise.all(getGuardiansPromiseArray).then(guardians => {
        this.guardians = guardians;
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
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the family'
        });
      }
    })
  }

  getInvoices(familyUnitID: string) {
    this.invoicesLoading = true;

    this.invoiceService.getInvoicesByFamily(familyUnitID).then(invoices => {
      this.invoices = invoices['invoices'];
      this.invoicesLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while loading the invoices'
        });
      }
      this.invoicesLoading = false;
    })
  }

  deleteInvoice(id: string) {
    this.invoicesLoading = true;
    this.invoiceService.deleteInvoice(id).then(() => {
      this.selectedInvoice = null;
      this.invoicesLoading = false;
      this.getInvoices(this.route.snapshot.params['id']);
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        if (err.status === 400) {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'You cannot delete an unpaid invoice'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while deleting the invoice'
          });
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
        this.selectedInvoice = null;
        this.invoicesLoading = false;
        this.getInvoices(this.route.snapshot.params['id']);
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred while updating the invoice'
          });
        }
        this.invoicesLoading = false;
      })
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred while getting the invoice'
        });
      }
      this.invoicesLoading = false;
    })
  }
}
