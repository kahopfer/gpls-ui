import {Component, Input, OnInit} from '@angular/core';

export interface Status {
  success: boolean,
  message: string
}

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.css']
})
export class SuccessAlertComponent implements OnInit {

  @Input() status: Status;

  constructor() {
  }

  ngOnInit() {
  }

}
