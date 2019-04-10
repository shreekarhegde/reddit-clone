import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareQueryService {
  public query: BehaviorSubject<string> = new BehaviorSubject<string>('');
  queryValue$ = this.query.asObservable();
  constructor() {}
  shareQuery(value) {
    this.query.next(value);
  }
}
