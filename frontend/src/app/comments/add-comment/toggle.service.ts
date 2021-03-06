import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  public bool: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  toggleValue$ = this.bool.asObservable();

  constructor() {}

  getToggleValue() {
    return this.bool;
  }

  setToggleValue(value) {
    this.bool.next(value);
  }
}
