import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import * as jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  public _userID: any = '';
  public url: string = 'http://localhost:3030/users';
  public headerParams: object = {};
  public accessToken: string = '';
  constructor(public httpService: HttpService, public tokenService: TokenService) {}

  getUserID() {
    let store = this.tokenService.getToken();
    let token = store['user'].hasOwnProperty('accessToken') ? store['user']['accessToken'] : store['user'];
    return new Promise((resolve, reject) => {
      var decoded = jwtDecode(token);
      this._userID = decoded.userId;
      return resolve(this._userID);
    });
  }

  async getUserProfile() {
    this._userID = await this.getUserID();

    console.log('getUserProfile: userID--------->', this._userID);

    this.headerParams = this.tokenService.checkTokenAndSetHeader();

    let query = '/?$populate=communities';

    return new Promise((resolve, reject) => {
      this.httpService.getRequest(`${this.url}/${this._userID}` + query, this.headerParams).subscribe(
        user => {
          console.log('user:getUserProfile:user-details-service======>', user);
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
