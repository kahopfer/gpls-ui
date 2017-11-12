import {Injectable} from "@angular/core";
import {GPLS_API_URL} from "../app.constants";
import {LineItem} from "../models/lineItem";
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class LineItemService {
  private gplsApiUrl: string;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getLineItem(id: string): Promise<LineItem> {
    const url = `${this.gplsApiUrl}/lineItems/${id}`;
    return this.http.get<LineItem>(url, {headers: this.headers}).toPromise();
  }

  getLineItemsByFamily(familyID: string): Promise<LineItem[]> {
    // TODO: Change back
    const url = `${this.gplsApiUrl}/lineItems?familyID=${familyID}&checkedOut=notNull&invoiced=null`;
    // const url = `${this.gplsApiUrl}/lineItems?familyID=${familyID}&checkedOut=notNull`;
    return this.http.get<LineItem[]>(url, {headers: this.headers}).toPromise();
  }

  getLineItemsByInvoiceID(invoiceID: string): Promise<LineItem[]> {
    const url = `${this.gplsApiUrl}/lineItems?invoiceID=${invoiceID}`;
    return this.http.get<LineItem[]>(url, {headers: this.headers}).toPromise();
  }

  getLineItemsWithoutCheckOut(studentID: string): Promise<LineItem[]> {
    const url = `${this.gplsApiUrl}/lineItems?studentID=${studentID}&checkedOut=null`;
    return this.http.get<LineItem[]>(url, {headers: this.headers}).toPromise();
  }

  createLineItem(lineItem: LineItem) {
    const url = `${this.gplsApiUrl}/lineItems`;
    return this.http.post(url, lineItem, {
      headers: this.headers,
      responseType: 'text'
    });
  }

  updateLineItem(lineItem: LineItem): Promise<string> {
    const url = `${this.gplsApiUrl}/lineItems/${lineItem._id}`;
    return this.http.put(url, lineItem, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }

  deleteLineItem(id: string): Promise<string> {
    const url = `${this.gplsApiUrl}/lineItems/${id}`;
    return this.http.delete(url, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }

  static determineServiceType(checkIn: Date, checkOut: Date): string {
    let format = 'HH:mm:ss';

    let checkInMoment = moment(checkIn, format);
    let checkOutMoment = moment(checkOut, format);

    let checkInDate = moment(checkIn).format('YYYY-MM-DD');

    let beforeCareStartTime = moment('00:00:00', format).format(format);
    let beforeCareEndTime = moment('12:00:00', format).format(format);

    let afterCareStartTime = moment('12:00:00', format).format(format);
    let afterCareEndTime = moment('23:59:59', format).format(format);

    let beforeCareStartToCompare = moment(checkInDate + ' ' + beforeCareStartTime);
    let beforeCareEndToCompare = moment(checkInDate + ' ' + beforeCareEndTime);

    let afterCareStartToCompare = moment(checkInDate + ' ' + afterCareStartTime);
    let afterCareEndToCompare = moment(checkInDate + ' ' + afterCareEndTime);

    if (checkInMoment.isBetween(beforeCareStartToCompare, beforeCareEndToCompare) && checkOutMoment.isBetween(beforeCareStartToCompare, beforeCareEndToCompare)) {
      return 'Before Care';
    } else if (checkInMoment.isBetween(afterCareStartToCompare, afterCareEndToCompare) && checkOutMoment.isBetween(afterCareStartToCompare, afterCareEndToCompare)) {
      return 'After Care';
    } else {
      return 'Unknown';
    }
  }
}
