import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public _communityID: string = '';

  @Output() subscribedCommunity = new EventEmitter();

  constructor() {}

  // get communityID() {
  //   return this._communityID;
  // }
  // set communityID(id) {
  //   this._communityID = id;
  // }

  shareCommunityID(id) {
    this._communityID = id;
    this.subscribedCommunity.emit(this._communityID);
  }
}
