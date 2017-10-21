import {Injectable} from "@angular/core";
import {GPLS_API_URL} from "../app.constants";
import {Http, Headers} from "@angular/http";
import {LineItem} from "../models/lineItem";
import 'rxjs/add/operator/toPromise';
import {ExtraItem} from "../models/extraItem";

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
    const url = `${this.gplsApiUrl}/lineItems?familyID=${familyID}&checkedOut=notNull`;
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

  createLineItem(familyID: string, studentID: string, checkIn: Date, checkOut: Date, extraItems: ExtraItem[],
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
      checkIn: checkIn,
      checkOut: checkOut,
      extraItems: extraItems,
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

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
