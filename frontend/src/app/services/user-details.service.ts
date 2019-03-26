import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { HttpHeaders } from '@angular/common/http';
import * as jwtDecode from 'jwt-decode';
// const jwtDecode = require('jwt-decode');

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  public _userID: string = '';
  public url: string = 'http://localhost:3030/users';
  public headerParams: object = {};
  public accessToken: string = '';
  constructor(public httpService: HttpService, public tokenService: TokenService) {}

  getUserID() {
    let store = this.tokenService.getToken();
    // console.log('getUserID: token', store);

    let token = store['user'].hasOwnProperty('accessToken') ? store['user']['accessToken'] : store['user'];
    var decoded = jwtDecode(token);
    this._userID = decoded.userId;
    // console.log('userid from  getUserId--------->', this._userID);
    return this._userID;
  }

  async getUserProfile() {
    // console.log('userID: getUserProfile---------->', this._userID);
    let userID = await this.getUserID();
    console.log('getUserProfile: userID--------->', this._userID);
    this.headerParams = await this.tokenService.checkTokenAndSetHeader();
    return new Promise((resolve, reject) => {
      this.httpService.getRequest(`${this.url}/${userID}`, this.headerParams).subscribe(
        user => {
          // console.log('user from getUserProfile--------->', user);
          return resolve(user);
        },
        err => {
          console.log(err);
          return reject(err);
        }
      );
    });
  }
}
