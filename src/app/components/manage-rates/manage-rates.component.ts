import {Component, OnInit} from '@angular/core';
import {PriceList} from "../../models/priceList";
import {PriceListService} from "../../service/priceList.service";
import {ConfirmationService, Message} from "primeng/primeng";

@Component({
  selector: 'app-manage-rates',
  templateUrl: './manage-rates.component.html',
  styleUrls: ['./manage-rates.component.css']
})
export class ManageRatesComponent implements OnInit {

  nonExtraPriceList: PriceList[];
  extraPriceList: PriceList[];

  selectedNonExtraPriceList: PriceList;
  selectedExtraPriceList: PriceList;
  priceList: PriceList = new PriceList();

  nonExtraPriceListLoading: boolean = true;
  extraPriceListLoading: boolean = true;

  newPriceList: boolean;
  displayPriceListDialog: boolean;

  msgs: Message[] = [];

  constructor(private priceListService: PriceListService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.getNonExtraPriceList();
    this.getExtraPriceList();
  }

  getNonExtraPriceList() {
    this.nonExtraPriceListLoading = true;
    this.priceListService.getNonExtraPriceList().then(priceList => {
      this.nonExtraPriceList = priceList['priceLists'];
      this.nonExtraPriceListLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity:'error', summary:'Error Message', detail:'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({severity:'error', summary:'Error Message', detail:'An error occurred while loading the price list'});
      }
      this.nonExtraPriceListLoading = false;
    });
  }

  getExtraPriceList() {
    this.extraPriceListLoading = true;
    this.priceListService.getExtraPriceList().then(priceList => {
      this.extraPriceList = priceList['priceLists'];
      this.extraPriceListLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity:'error', summary:'Error Message', detail:'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({severity:'error', summary:'Error Message', detail:'An error occurred while loading the price list'});
      }
      this.extraPriceListLoading = false;
    });
  }

  deletePriceList(id: string) {
    this.priceListService.deletePriceList(id).then(() => {
      this.priceList = null;
      this.displayPriceListDialog = false;
      this.getExtraPriceList();
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity:'error', summary:'Error Message', detail:'An unexpected error occurred'});
      } else {
        if (err.status === 400) {
          this.msgs.push({severity:'error', summary:'Error Message', detail:'You cannot delete rates that are in uninvoiced line items'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.msgs.push({severity:'error', summary:'Error Message', detail:'An error occurred while deleting the rate'});
        }
      }
    });
  }

  confirmDeletePriceList(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this rate?',
      header: 'Delete Rate Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deletePriceList(id);
      }
    })
  }

  savePriceList(priceList: PriceList) {
    // If the priceList is not new, then update the selected priceList
    if (this.newPriceList === false) {
      this.priceListService.updatePriceList(priceList).then(() => {
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
          this.msgs.push({severity:'error', summary:'Error Message', detail:'An unexpected error occurred'});
        } else {
          if (err.status === 400) {
            this.msgs.push({severity:'error', summary:'Error Message', detail:'The item value cannot be less than zero'});
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({severity:'error', summary:'Error Message', detail:'An error occurred while updating the rate information'});
          }
        }
      })
    } else {
      this.priceList.itemExtra = true;
      this.priceListService.createPriceList(this.priceList).subscribe(() => {
        this.priceList = null;
        this.displayPriceListDialog = false;
        this.getExtraPriceList()
      }, err => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          this.msgs.push({severity:'error', summary:'Error Message', detail:'An unexpected error occurred'});
        } else {
          if (err.status === 400) {
            this.msgs.push({severity:'error', summary:'Error Message', detail:'The item value cannot be less than zero'});
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.msgs.push({severity:'error', summary:'Error Message', detail:'An error occurred while creating the new rate'});
          }
        }
      })
    }
  }

  onPriceListSelect(event) {
    this.newPriceList = false;
    this.priceListService.getPriceList(event.data._id).then(priceList => {
      this.priceList = priceList;
      this.displayPriceListDialog = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity:'error', summary:'Error Message', detail:'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        this.msgs.push({severity:'error', summary:'Error Message', detail:'An error occurred while loading the rate information'});
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
