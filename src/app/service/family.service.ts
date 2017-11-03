import {Injectable} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {GPLS_API_URL} from "../app.constants";
import {ObjectID} from 'bson';
import {Family} from "../models/family";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class FamilyService {
  private gplsApiUrl: string;

  constructor(private http: HttpClient) {
    this.gplsApiUrl = GPLS_API_URL;
  }

  getFamilies(): Promise<Family> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/families`;
    return this.http.get<Family>(url, {headers: headers})
      .toPromise();
  }

  getFamily(id: string): Promise<Family> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/families/${id}`;
    return this.http.get<Family>(url, {headers: headers})
      .toPromise();
  }

  createFamily(family: Family) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/families/`;
    return this.http.post(url, family, {
      headers: headers,
      responseType: 'text'
    });
  }

  updateFamily(family: Family): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.gplsApiUrl}/families/${family._id}`;
    return this.http.put(url, family, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }

  deleteFamily(id: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const url = `${this.gplsApiUrl}/families/${id}`;
    return this.http.delete(url, {
      headers: headers,
      responseType: 'text'
    })
      .toPromise();
  }
}
