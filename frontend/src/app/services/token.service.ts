import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public _accessToken: string = '';
  public _headerParams: object = {};
  public isLoggedIn: boolean = false;
  constructor() {}

  setToken(data) {
    localStorage.setItem('user', JSON.stringify({ user: data }));
  }

  getToken() {
    this._accessToken = JSON.parse(localStorage.getItem('user'));

    return this._accessToken;
  }

  checkTokenAndSetHeader() {
    this._accessToken = this.getToken()['user']['accessToken'] ? this.getToken()['user']['accessToken'] : this.getToken()['user'];

    console.log('checkTokenAndSetHeader---------->', this._accessToken);

    this._headerParams = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this._accessToken
      })
    };
    return this._headerParams;
  }

  checkStatus() {
    let token = this.getToken();
    console.log('token', token);
    if (token) {
      this.isLoggedIn = true;
      return this.isLoggedIn;
    } else {
      this.isLoggedIn = false;
      return this.isLoggedIn;
    }
  }
}
