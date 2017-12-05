import {Injectable} from "@angular/core";
import {GPLS_API_URL} from "../app.constants";
import {LineItem} from "../models/lineItem";
import 'rxjs/add/operator/toPromise';
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
    const url = `${this.gplsApiUrl}/lineItems?familyID=${familyID}&checkedOut=notNull&invoiced=null`;
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

  getLineItemsByRange(familyID: string, fromDate: Date, toDate: Date): Promise<LineItem[]> {
    const url = `${this.gplsApiUrl}/lineItems?familyID=${familyID}&checkedOut=notNull&invoiced=null&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`;
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
}
