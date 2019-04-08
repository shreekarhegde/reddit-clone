import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  postRequest(url, data, headerParams) {
    if (headerParams) {
      return this.http.post(url, data, headerParams);
    } else {
      return this.http.post(url, data);
    }
  }

  getRequest(url, data) {
    return this.http.get(url, data);
  }

  patchRequest(url, data, headerParams) {
    return this.http.patch(url, data, headerParams);
  }

  deleteRequest(url, headerParams) {
    return this.http.delete(url, headerParams);
  }
}
