import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() {}

  setToken(data) {
    localStorage.setItem('user', JSON.stringify({ user: data }));
    console.log(localStorage, 'localstorage from set Token');
  }

  getToken() {
    return JSON.parse(localStorage.getItem('user'));
  }
}
