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

    this.addList = new BehaviorSubject<boolean>(false);
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

  /* --------- ADD SCHED COMPONENT MODAL ------------- */

  private addList: BehaviorSubject<boolean>;

  public addListModal = (value: boolean) => {
    this.addList.next(value);
  };

  public addList$ = () => {
    return this.addList.asObservable();
  };
}
