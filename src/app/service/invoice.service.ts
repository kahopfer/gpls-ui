import {Injectable} from '@angular/core';
import {GPLS_API_URL} from "../app.constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Invoice} from "../models/invoice";

@Injectable()
export class InvoiceService {
  private gplsApiUrl: string;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getInvoice(id: string): Promise<Invoice> {
    const url = `${this.gplsApiUrl}/invoices/${id}`;
    return this.http.get<Invoice>(url, {headers: this.headers}).toPromise();
  }

  getInvoices() {
    const url = `${this.gplsApiUrl}/invoices`;
    return this.http.get<Invoice[]>(url, {headers: this.headers}).toPromise();
  }

  getInvoicesByFamily(familyID: string): Promise<Invoice[]> {
    const url = `${this.gplsApiUrl}/invoices?familyID=${familyID}`;
    return this.http.get<Invoice[]>(url, {headers: this.headers}).toPromise();
  }

  createInvoice(invoice: Invoice) {
    const url = `${this.gplsApiUrl}/invoices`;
    return this.http.post(url, invoice, {
      headers: this.headers,
      responseType: 'text'
    });
  }

  updateInvoice(invoice: Invoice): Promise<string> {
    const url = `${this.gplsApiUrl}/invoices/${invoice._id}`;
    return this.http.put(url, invoice, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }

  deleteInvoice(id: string): Promise<string> {
    const url = `${this.gplsApiUrl}/invoices/${id}`;
    return this.http.delete(url, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }
}
