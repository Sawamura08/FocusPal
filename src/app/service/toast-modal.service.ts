import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { toastModal } from '../interfaces/export.object';

@Injectable({
  providedIn: 'root',
})
export class ToastModalService {
  private toastModal$: BehaviorSubject<toastModal>;
  private toastType: toastModal;
  constructor() {
    this.toastType = {
      type: 'Update',
      status: false,
    };
    this.toastModal$ = new BehaviorSubject<toastModal>(this.toastType);
  }

  public getToastModal = () => {
    return this.toastModal$.asObservable();
  };

  public switchToastModal = (value: toastModal) => {
    this.toastModal$.next(value);
  };
}
