import { Injectable } from '@angular/core';
const jwtDecode = require('jwt-decode');

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  public _userID;

  constructor() {}

  setUserID(token) {
    var decoded = jwtDecode(token, { header: true });
    this._userID = decoded.userId;
  }

  getUserID() {
    return this._userID;
  }
}
