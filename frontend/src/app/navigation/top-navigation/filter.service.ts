import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public filter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filterValue$ = this.filter.asObservable();

  constructor() {}

  shareFilterValue(value) {
    this.filter.next(value);
  }
}
