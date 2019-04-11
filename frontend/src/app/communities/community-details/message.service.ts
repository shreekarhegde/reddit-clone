import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public message: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  messageValue$ = this.message.asObservable();

  constructor() {}

  shareMessageValue(value) {
    this.message.next(value);
  }
}
