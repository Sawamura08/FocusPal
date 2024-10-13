import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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

    this.updateList = new BehaviorSubject<boolean>(false);

    this.confirmModalStatus$ = new BehaviorSubject<boolean>(false);
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

  /* -------- UPDATE SCHED COMPONENT MODAL */

  private updateList: BehaviorSubject<boolean>;

  public isModalOpen = (value: boolean) => {
    this.updateList.next(value);
  };

  public updateList$ = () => {
    return this.updateList.asObservable();
  };

  /* END */

  /* OPEN OR CLOSE CONFIRMATION MODAL */

  private confirmModalStatus$: BehaviorSubject<boolean>;

  public setConfirmaModalStatus = (value: boolean) => {
    this.confirmModalStatus$.next(value);
  };

  public getConfirmModalStatus = () => {
    return this.confirmModalStatus$.asObservable();
  };

  /* END */

  /* CONFIRMATION RESPONSE MODAL */

  private confirmationModal$: Subject<boolean> = new Subject<boolean>();

  public getConfirmationModal = () => {
    return this.confirmationModal$.asObservable();
  };

  public sendValueModal = (value: boolean) => {
    this.confirmationModal$.next(value);
  };

  /* END */
}
