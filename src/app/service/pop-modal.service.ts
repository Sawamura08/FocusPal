import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum ModalType {
  NONE,
  EMAIL_USED,
  NO_INTERNET,
  INCORRECT,
}

@Injectable({
  providedIn: 'root',
})
export class PopModalService {
  modalSubject$: BehaviorSubject<ModalType>;
  constructor() {
    this.modalSubject$ = new BehaviorSubject<ModalType>(ModalType.NONE);
  }

  public openModal = (modalType: ModalType) => {
    this.modalSubject$.next(modalType);
  };

  public closeModal = () => {
    this.modalSubject$.next(ModalType.NONE);
  };

  public getModalStatus = () => {
    return this.modalSubject$.asObservable();
  };
}
