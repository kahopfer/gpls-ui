import {Injectable} from "@angular/core";
import {GPLS_API_URL} from "../app.constants";
import {Http, Headers} from "@angular/http";
import {LineItem} from "../models/lineItem";
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

@Injectable()
export class LineItemService {
  private gplsApiUrl: string;

  constructor(private http: Http) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getLineItem(id: string): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/lineItems/${id}`;
    return this.http.get(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  getLineItemsByFamily(familyID: string): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/lineItems?familyID=${familyID}&checkedOut=notNull&invoiced=null`;
    return this.http.get(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  getUninvoicedLineItemsByStudent(studentID: string): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/lineItems?studentID=${studentID}&invoiced=null`;
    return this.http.get(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  getUninvoicedLineItemsByFamily(familyID: string): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/lineItems?familyID=${familyID}&invoiced=null`;
    return this.http.get(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  getLineItemsWithoutCheckOut(studentID: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/lineItems?studentID=${studentID}&checkedOut=null`;
    return this.http.get(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  createLineItem(familyID: string, studentID: string, extraItem: boolean, checkIn: Date, checkOut: Date, serviceType: string,
                 earlyInLateOutFee: number, lineTotalCost: number, checkInBy: string, checkOutBy: string, notes: string,
                 invoiceID: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/lineItems`;
    return this.http.post(url, JSON.stringify({
      familyID: familyID,
      studentID: studentID,
      extraItem: extraItem,
      checkIn: checkIn,
      checkOut: checkOut,
      serviceType: serviceType,
      earlyInLateOutFee: earlyInLateOutFee,
      lineTotalCost: lineTotalCost,
      checkInBy: checkInBy,
      checkOutBy: checkOutBy,
      notes: notes,
      invoiceID: invoiceID
    }), {headers: headers});
  }

  updateLineItem(lineItem: LineItem): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/lineItems/${lineItem._id}`;
    return this.http.put(url, JSON.stringify(lineItem), {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  deleteLineItem(id: string): Promise<void> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/lineItems/${id}`;
    return this.http.delete(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  determineServiceType(checkIn: Date, checkOut: Date): string {
    let format = 'HH:mm';

    let checkInMoment = moment(checkIn, format);
    let checkOutMoment = moment(checkOut, format);

    let checkInDate = moment(checkIn).format('YYYY-MM-DD');

    let beforeCareStartTime = moment('00:00', format).format(format);
    let beforeCareEndTime = moment('12:00', format).format(format);

    let afterCareStartTime = moment('12:01', format).format(format);
    let afterCareEndTime = moment('23:59', format).format(format);

    let beforeCareStartToCompare = moment(checkInDate+' '+beforeCareStartTime);
    let beforeCareEndToCompare = moment(checkInDate+' '+beforeCareEndTime);

    let afterCareStartToCompare = moment(checkInDate+' '+afterCareStartTime);
    let afterCareEndToCompare = moment(checkInDate+' '+afterCareEndTime);

    if (checkInMoment.isBetween(beforeCareStartToCompare, beforeCareEndToCompare) && checkOutMoment.isBetween(beforeCareStartToCompare, beforeCareEndToCompare)) {
      return 'Before Care';
    } else if (checkInMoment.isBetween(afterCareStartToCompare, afterCareEndToCompare) && checkOutMoment.isBetween(afterCareStartToCompare, afterCareEndToCompare)) {
      return 'After Care';
    } else {
      return 'Unknown';
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
