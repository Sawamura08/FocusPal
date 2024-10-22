import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateTaskModeService {
  public updateMode$: BehaviorSubject<boolean>;
  constructor() {
    this.updateMode$ = new BehaviorSubject<boolean>(false);
  }

  public getUpdateModeStatus = () => {
    return this.updateMode$.asObservable();
  };

  /* TRUE= OPEN UPATEMODE */
  public isUpdateMode = (mode: boolean) => {
    this.updateMode$.next(mode);
  };
}
