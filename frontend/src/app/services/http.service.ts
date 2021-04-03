import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
let preUrl = '';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {
    console.log('environment--->',environment);
    preUrl = environment.apiUrl
  }

  postRequest(url, data, headerParams) {
    url = preUrl + url;
    if (headerParams) {
      return this.http.post(url, data, headerParams);
    } else {
      return this.http.post(url, data);
    }
  }

  getRequest(url, data) {
    url = preUrl + url;
    return this.http.get(url, data);
  }

  patchRequest(url, data, headerParams) {
    url = preUrl + url;
    return this.http.patch(url, data, headerParams);
  }

  deleteRequest(url, headerParams) {
    url = preUrl + url;
    return this.http.delete(url, headerParams);
  }
}
