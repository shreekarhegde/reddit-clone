import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public _data;

  constructor() {}

  setData(data) {
    this._data = data;
  }

  getData() {
    return this._data;
  }
}
