import {Injectable} from "@angular/core";
import {GPLS_API_URL} from "../app.constants";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PriceListService {
  private gplsApiUrl: string;

  constructor(private http: Http) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getNonExtraPriceList(): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/priceList?itemExtra=false`;
    return this.http.get(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  getExtraPriceList(): Promise<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.gplsApiUrl}/priceList?itemExtra=true`;
    return this.http.get(url, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
