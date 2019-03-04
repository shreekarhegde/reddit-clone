import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of, Subject, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  postRequest(url, data) {
    return this.http.post(url, data).pipe(catchError(this.handleError));
  }

  getRequest(url, data) {
    return this.http.get(url, data).pipe(catchError(this.handleError));
  }

  handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.log('client side error---->', errorResponse.error.message);
    } else {
      console.log('server side error---->', errorResponse);
    }
    return throwError('there is a problem with this service');
  }
}
