import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public idSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public filterSource: BehaviorSubject<string> = new BehaviorSubject<string>('');

  subscribedID$ = this.idSource.asObservable();
  chosenFilter$ = this.filterSource.asObservable();

  constructor() {}

  shareID(id: string) {
    this.idSource.next(id);
  }

  shareFilter(filter: string) {
    console.log(filter);
    this.filterSource.next(filter);
  }
}
