import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-context-help',
  templateUrl: './context-help.component.html',
  styleUrls: ['./context-help.component.css']
})
export class ContextHelpComponent implements OnInit {

  @Input() pageName: string;
  display: boolean = false;
  helpMessage: string;

  constructor() {
  }

  ngOnInit() {
    switch (this.pageName) {
      case 'add-user':
        this.helpMessage = 'Add user help';
        break;
      case 'sign-in':
        this.helpMessage = 'Sign in help';
        break;
      case 'sign-in-details':
        this.helpMessage = 'Sign in details help';
        break;
      case 'sign-out':
        this.helpMessage = 'Sign out help';
        break;
      case 'sign-out-details':
        this.helpMessage = 'Sign out details help';
        break;
      case 'create-invoice':
        this.helpMessage = 'Create invoice help';
        break;
      case 'create-invoice-details':
        this.helpMessage = 'Create invoice details help';
        break;
      case 'enroll-family':
        this.helpMessage = 'Enroll family help';
        break;
      case 'family-details-admin':
        this.helpMessage = 'Family details help (admin)';
        break;
      case 'family-details-regular':
        this.helpMessage = 'Family details help (regular)';
        break;
      case 'family-list':
        this.helpMessage = 'Family list help';
        break;
      case 'invoice-details':
        this.helpMessage = 'Invoice details help';
        break;
      case 'invoice-list':
        this.helpMessage = 'Invoice list help';
        break;
      case 'invoices':
        this.helpMessage = 'Invoices help';
        break;
      case 'manage-rates':
        this.helpMessage = 'Manage rates help';
        break;
      case 'reset-password':
        this.helpMessage = 'Reset password help';
        break;
      case 'user-list':
        this.helpMessage = 'User list help';
        break;
      case 'user-profile':
        this.helpMessage = 'User profile help';
        break;
      case 'inactive-family-list':
        this.helpMessage = 'Inactive family list help';
        break;
      case 'inactive-family-details':
        this.helpMessage = 'Inactive family details help';
        break;
      default:
        this.helpMessage = 'N/A';
    }
  }
}
