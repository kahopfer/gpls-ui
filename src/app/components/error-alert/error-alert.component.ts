import {Component, Input, OnInit} from '@angular/core';

export interface Status {
  success: boolean,
  message: string
}

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.css']
})
export class ErrorAlertComponent implements OnInit {

  @Input() status: Status;

  constructor() {
  }

  ngOnInit() {
  }

}
