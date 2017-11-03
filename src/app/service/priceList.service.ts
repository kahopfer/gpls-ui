import {Injectable} from "@angular/core";
import {GPLS_API_URL} from "../app.constants";
import 'rxjs/add/operator/toPromise';
import {PriceList} from "../models/priceList";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class PriceListService {
  private gplsApiUrl: string;

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getPriceList(id: string): Promise<PriceList> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/priceList/${id}`;
    return this.http.get<PriceList>(url, {headers: headers})
      .toPromise();
  }

  getNonExtraPriceList(): Promise<PriceList> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/priceList?itemExtra=false`;
    return this.http.get<PriceList>(url, {headers: headers})
      .toPromise();
  }

  getExtraPriceList(): Promise<PriceList> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/priceList?itemExtra=true`;
    return this.http.get<PriceList>(url, {headers: headers})
      .toPromise();
  }

  createPriceList(priceList: PriceList) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/priceList`;
    return this.http.post(url, priceList, {
      headers: headers,
      responseType: 'text'
    });
  }

  updatePriceList(priceList: PriceList): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/priceList/${priceList._id}`;
    return this.http.put(url, priceList, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  deletePriceList(id: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const url = `${this.gplsApiUrl}/priceList/${id}`;
    return this.http.delete(url, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }
}
