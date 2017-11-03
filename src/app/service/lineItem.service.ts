import {Injectable} from "@angular/core";
import {GPLS_API_URL} from "../app.constants";
import {LineItem} from "../models/lineItem";
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class LineItemService {
  private gplsApiUrl: string;

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getLineItem(id: string): Promise<LineItem> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/lineItems/${id}`;
    return this.http.get<LineItem>(url, {headers: headers})
      .toPromise();
  }

  getLineItemsByFamily(familyID: string): Promise<LineItem> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/lineItems?familyID=${familyID}&checkedOut=notNull&invoiced=null`;
    return this.http.get<LineItem>(url, {headers: headers})
      .toPromise();
  }

  getUninvoicedLineItemsByStudent(studentID: string): Promise<LineItem> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/lineItems?studentID=${studentID}&invoiced=null`;
    return this.http.get<LineItem>(url, {headers: headers})
      .toPromise();
  }

  getUninvoicedLineItemsByFamily(familyID: string): Promise<LineItem> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/lineItems?familyID=${familyID}&invoiced=null`;
    return this.http.get<LineItem>(url, {headers: headers})
      .toPromise();
  }

  getLineItemsWithoutCheckOut(studentID: string): Promise<LineItem> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/lineItems?studentID=${studentID}&checkedOut=null`;
    return this.http.get<LineItem>(url, {headers: headers})
      .toPromise();
  }

  getUninvoicedLineItemsByServiceType(serviceType: string): Promise<LineItem> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/lineItems?serviceType=${serviceType}&invoiced=null`;
    return this.http.get<LineItem>(url, {headers: headers})
      .toPromise();
  }

  createLineItem(lineItem: LineItem) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/lineItems`;
    return this.http.post(url, lineItem, {
      headers: headers,
      responseType: 'text'
    });
  }

  updateLineItem(lineItem: LineItem): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/lineItems/${lineItem._id}`;
    return this.http.put(url, lineItem, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  deleteLineItem(id: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const url = `${this.gplsApiUrl}/lineItems/${id}`;
    return this.http.delete(url, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  determineServiceType(checkIn: Date, checkOut: Date): string {
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
