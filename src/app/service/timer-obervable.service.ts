import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerObervableService {
  constructor() {}

  public displayCountdown$ = new BehaviorSubject<string>('0');

  public setCountDownDisplay = (count: string) => {
    this.displayCountdown$.next(count);
  };

  public getcountDownDisplay = () => {
    return this.displayCountdown$.asObservable();
  };
}
