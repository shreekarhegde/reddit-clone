import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public _accessToken: string = '';
  public _headerParams: object = {};
  constructor() {}

  setToken(data) {
    localStorage.setItem('user', JSON.stringify({ user: data }));
    // console.log(localStorage, 'localstorage from set Token');
  }

  getToken() {
    this._accessToken = JSON.parse(localStorage.getItem('user'));
    // return JSON.parse(localStorage.getItem('user'));
    // console.log('getToken----------->', this._accessToken);
    return this._accessToken;
  }

  async checkTokenAndSetHeader() {
    this._accessToken = (await this.getToken()['user']['accessToken'])
      ? await this.getToken()['user']['accessToken']
      : await this.getToken()['user'];

    // console.log('checkTokenAndSetHeader---------->', this._accessToken);

    this._headerParams = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this._accessToken
      })
    };

    // console.log('header params: checkandSet--------->', this._headerParams);
    return this._headerParams;
  }
}
