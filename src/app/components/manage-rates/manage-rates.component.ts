import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-manage-rates',
  templateUrl: './manage-rates.component.html',
  styleUrls: ['./manage-rates.component.css']
})
export class ManageRatesComponent implements OnInit {

  rates: any[];

  constructor() {
  }

  ngOnInit() {
    this.rates = [{
      name: 'Before Care Full Week',
      value: 31.00,
      extra: false
    }, {
      name: 'Before Care Full Morning',
      value: 6.60,
      extra: false
    }, {
      name: 'Before Care Hour or Less',
      value: 3.90,
      extra: false
    }, {
      name: 'After Care Full Week',
      value: 40.00,
      extra: false
    }, {
      name: 'After Care Full Afternoon',
      value: 8.90,
      extra: false
    }, {
      name: 'After Care Hour or Less',
      value: 4.45,
      extra: false
    }, {
      name: 'Early In Late Out',
      value: 1.25,
      extra: false
    }, {
      name: 'Breakfast',
      value: 1.25,
      extra: true
    }]
  }

  saveChanges() {
    console.log('Changes saved!');
  }

}
