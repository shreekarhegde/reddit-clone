import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public idSource: BehaviorSubject<string> = new BehaviorSubject<string>('');

  subscribedCommunity$ = this.idSource.asObservable();

  constructor() {}

  shareCommunityID(id: string) {
    this.idSource.next(id);
  }
}
