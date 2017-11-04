import {Injectable} from "@angular/core";
import {GPLS_API_URL} from "../app.constants";
import 'rxjs/add/operator/toPromise';
import {PriceList} from "../models/priceList";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class PriceListService {
  private gplsApiUrl: string;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getPriceList(id: string): Promise<PriceList> {
    const url = `${this.gplsApiUrl}/priceList/${id}`;
    return this.http.get<PriceList>(url, {headers: this.headers}).toPromise();
  }

  getNonExtraPriceList(): Promise<PriceList[]> {
    const url = `${this.gplsApiUrl}/priceList?itemExtra=false`;
    return this.http.get<PriceList[]>(url, {headers: this.headers}).toPromise();
  }

  getExtraPriceList(): Promise<PriceList[]> {
    const url = `${this.gplsApiUrl}/priceList?itemExtra=true`;
    return this.http.get<PriceList[]>(url, {headers: this.headers}).toPromise();
  }

  createPriceList(priceList: PriceList) {
    const url = `${this.gplsApiUrl}/priceList`;
    return this.http.post(url, priceList, {
      headers: this.headers,
      responseType: 'text'
    });
  }

  updatePriceList(priceList: PriceList): Promise<string> {
    const url = `${this.gplsApiUrl}/priceList/${priceList._id}`;
    return this.http.put(url, priceList, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }

  deletePriceList(id: string): Promise<string> {
    const url = `${this.gplsApiUrl}/priceList/${id}`;
    return this.http.delete(url, {
      headers: this.headers,
      responseType: 'text'
    }).toPromise();
  }
}
