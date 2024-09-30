import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkStatusService {
  constructor() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);

  private updateOnlineStatus = (status: boolean) => {
    this.onlineStatus.next(status);
  };

  public networkStatus$ = () => {
    return this.onlineStatus.asObservable();
  };
}
