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
      this.nonExtraPriceList = priceList['data']['priceLists'];
      this.nonExtraPriceListLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        try {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
        } catch (e) {
          if (err.status === 401) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Unauthorized. Please try logging out and logging back in again.'
            });
          } else {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
          }
        }
      }
      this.nonExtraPriceListLoading = false;
    });
  }

  getExtraPriceList() {
    this.extraPriceListLoading = true;
    this.priceListService.getExtraPriceList().then(priceList => {
      this.extraPriceList = priceList['data']['priceLists'];
      this.extraPriceListLoading = false;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        try {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
        } catch (e) {
          if (err.status === 401) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Unauthorized. Please try logging out and logging back in again.'
            });
          } else {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
          }
        }
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
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        try {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
        } catch (e) {
          if (err.status === 401) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Unauthorized. Please try logging out and logging back in again.'
            });
          } else {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
          }
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
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          try {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
          } catch (e) {
            if (err.status === 401) {
              this.msgs.push({
                severity: 'error',
                summary: 'Error Message',
                detail: 'Unauthorized. Please try logging out and logging back in again.'
              });
            } else {
              this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
            }
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
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          try {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
          } catch (e) {
            if (err.status === 401) {
              this.msgs.push({
                severity: 'error',
                summary: 'Error Message',
                detail: 'Unauthorized. Please try logging out and logging back in again.'
              });
            } else {
              this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
            }
          }
        }
      })
    }
  }

  onPriceListSelect(event) {
    this.newPriceList = false;
    this.priceListService.getPriceList(event.data._id).then(priceList => {
      this.priceList = priceList['data'];
      this.displayPriceListDialog = true;
    }).catch(err => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
        this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An unexpected error occurred'});
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        try {
          this.msgs.push({severity: 'error', summary: 'Error Message', detail: JSON.parse(err.error).error});
        } catch (e) {
          if (err.status === 401) {
            this.msgs.push({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Unauthorized. Please try logging out and logging back in again.'
            });
          } else {
            this.msgs.push({severity: 'error', summary: 'Error Message', detail: 'An error occurred'});
          }
        }
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
