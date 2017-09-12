import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "./app.constants";

@Injectable()
export class DataService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private headers1 = new Headers({'Accept': 'application/json', 'Content-Type': 'application/json'});
  private gplsApiUrl: string;

  constructor(private http: Http) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getParents(): Promise<any> {
    const url = `${this.gplsApiUrl}/parents`;
    return this.http.get(url)
      .toPromise()
      .catch(this.handleError);
  }

  getParent(id: number): Promise<any> {
    const url = `${this.gplsApiUrl}/parents/${id}`;
    return this.http.get(url)
      .toPromise()
      .catch(this.handleError);
  }

  getChildren(): Promise<any> {
    const url = `${this.gplsApiUrl}/children`;
    return this.http.get(url)
      .toPromise()
      .catch(this.handleError);
  }

  getChild(id: number): Promise<any> {
    const url = `${this.gplsApiUrl}/children/${id}`;
    return this.http.get(url)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
