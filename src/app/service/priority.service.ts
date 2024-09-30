import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PriorityService {
  private priorityLevel = new BehaviorSubject<number>(1);
  constructor() {}

  public changePriority = (level: number) => {
    this.priorityLevel.next(level);
  };

  public priorityLevel$ = (): Observable<number> => {
    return this.priorityLevel.asObservable();
  };
}
