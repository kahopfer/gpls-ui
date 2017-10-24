import {Component, OnInit} from '@angular/core';
import {Status} from "../error-alert/error-alert.component";
import {PriceList} from "../../models/priceList";
import {PriceListService} from "../../service/priceList.service";

@Component({
  selector: 'app-manage-rates',
  templateUrl: './manage-rates.component.html',
  styleUrls: ['./manage-rates.component.css']
})
export class ManageRatesComponent implements OnInit {

  nonExtraPriceList: PriceList[];
  extraPriceList: PriceList[];

  nonExtraPriceListStatus: Status;
  extraPriceListStatus: Status;

  nonExtraPriceListLoading: boolean = true;
  extraPriceListLoading: boolean = true;

  constructor(private priceListService: PriceListService) {
    this.nonExtraPriceListStatus = {
      success: null,
      message: null
    };

    this.extraPriceListStatus = {
      success: null,
      message: null
    };
  }

  ngOnInit() {
    this.getNonExtraPriceList();
    this.getExtraPriceList();
  }

  getNonExtraPriceList() {
    this.nonExtraPriceListLoading = true;
    this.priceListService.getNonExtraPriceList().then(priceList => {
      this.nonExtraPriceList = priceList.json().priceLists;
      this.nonExtraPriceListStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.nonExtraPriceListStatus.success = false;
        this.nonExtraPriceListStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.nonExtraPriceListStatus.success = false;
        this.nonExtraPriceListStatus.message = 'An error occurred while loading the price list';
      }
    });
    this.nonExtraPriceListLoading = false;
  }

  getExtraPriceList() {
    this.extraPriceListLoading = true;
    this.priceListService.getExtraPriceList().then(priceList => {
      this.extraPriceList = priceList.json().priceLists;
      this.extraPriceListStatus.success = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.extraPriceListStatus.success = false;
        this.extraPriceListStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.extraPriceListStatus.success = false;
        this.extraPriceListStatus.message = 'An error occurred while loading the price list';
      }
    });
    this.extraPriceListLoading = false;
  }

  saveChanges() {
    console.log('Changes saved!');
  }

}
