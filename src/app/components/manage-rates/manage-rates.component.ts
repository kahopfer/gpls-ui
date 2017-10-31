import {Component, OnInit} from '@angular/core';
import {Status} from "../error-alert/error-alert.component";
import {PriceList} from "../../models/priceList";
import {PriceListService} from "../../service/priceList.service";
import {LineItemService} from "../../service/lineItem.service";

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
  priceListStatus: Status;

  selectedNonExtraPriceList: PriceList;
  selectedExtraPriceList: PriceList;
  priceList: PriceList = new PriceList();

  nonExtraPriceListLoading: boolean = true;
  extraPriceListLoading: boolean = true;

  newPriceList: boolean;
  displayPriceListDialog: boolean;

  constructor(private priceListService: PriceListService, private lineItemService: LineItemService) {
    this.nonExtraPriceListStatus = {
      success: null,
      message: null
    };

    this.extraPriceListStatus = {
      success: null,
      message: null
    };

    this.priceListStatus = {
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
      this.nonExtraPriceListLoading = false;
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
      this.nonExtraPriceListLoading = false;
    });
  }

  getExtraPriceList() {
    this.extraPriceListLoading = true;
    this.priceListService.getExtraPriceList().then(priceList => {
      this.extraPriceList = priceList.json().priceLists;
      this.extraPriceListStatus.success = true;
      this.extraPriceListLoading = false;
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
      this.extraPriceListLoading = false;
    });
  }

  deletePriceList(id: string) {
    this.lineItemService.getLineItemsByServiceType(this.priceList.itemName).then(lineItems => {
      if (lineItems.json().lineItems.length > 0) {
        this.priceListStatus.success = false;
        this.priceListStatus.message = 'You cannot delete rates that are in uninvoiced line items';
        return;
      } else {
        this.priceListService.deletePriceList(id).then(() => {
          this.priceListStatus.success = true;
          this.priceList = null;
          this.displayPriceListDialog = false;
          this.getExtraPriceList();
        }).catch(err => {
          if (err.error instanceof Error) {
            console.log('An error occurred:', err.error.message);
            this.priceListStatus.success = false;
            this.priceListStatus.message = 'An unexpected error occurred';
          } else {
            if (err.status === 400) {
              this.priceListStatus.success = false;
              this.priceListStatus.message = 'You can only delete extra items'
            } else {
              console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
              this.priceListStatus.success = false;
              this.priceListStatus.message = 'An error occurred while deleting the rate';
            }
          }
        });
      }
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.priceListStatus.success = false;
        this.priceListStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.priceListStatus.success = false;
        this.priceListStatus.message = 'An error occurred while loading the rate\'s line items';
      }
    });
  }

  savePriceList(priceList: PriceList) {
    // If the priceList is not new, then update the selected priceList
    if (this.newPriceList === false) {
      this.priceListService.updatePriceList(priceList).then(() => {

        this.priceListStatus.success = true;
        this.priceList = null;

        if (priceList.itemExtra) {
          this.getExtraPriceList();
        } else {
          this.getNonExtraPriceList();
        }

        this.displayPriceListDialog = false;
      }).catch(err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.priceListStatus.success = false;
          this.priceListStatus.message = 'An unexpected error occurred';
        } else {
          if (err.status === 400) {
            this.priceListStatus.success = false;
            this.priceListStatus.message = 'The item value cannot be less than zero'
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.priceListStatus.success = false;
            this.priceListStatus.message = 'An error occurred while updating the rate information';
          }
        }
      })
    } else {
      this.priceListService.createPriceList(this.priceList.itemName, this.priceList.itemValue).subscribe(() => {
        this.priceListStatus.success = true;
        this.priceList = null;
        this.displayPriceListDialog = false;
        this.getExtraPriceList()
      }, err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.priceListStatus.success = false;
          this.priceListStatus.message = 'An unexpected error occurred';
        } else {
          if (err.status === 400) {
            this.priceListStatus.success = false;
            this.priceListStatus.message = 'The item value cannot be less than zero'
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.priceListStatus.success = false;
            this.priceListStatus.message = 'An error occurred while creating the new rate';
          }
        }
      })
    }
  }

  onPriceListSelect(event) {
    this.newPriceList = false;
    this.priceListService.getPriceList(event.data._id).then(priceList => {
      this.priceList = JSON.parse(priceList._body);
      this.priceListStatus.success = true;
      this.displayPriceListDialog = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.priceListStatus.success = false;
        this.priceListStatus.message = 'An unexpected error occurred';
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.priceListStatus.success = false;
        this.priceListStatus.message = 'An error occurred while loading the rate information';
      }
    });
    this.displayPriceListDialog = true;
  }

  showDialogToAddPriceList() {
    this.newPriceList = true;
    this.priceList = new PriceList();
    this.priceList.itemExtra = true;
    this.displayPriceListDialog = true;
  }
}
