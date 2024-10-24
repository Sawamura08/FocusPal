import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export enum ModalType {
  NONE,
  EMAIL_USED,
  NO_INTERNET,
  INCORRECT,
}

export interface updateMode {
  mode: boolean;
  isOpen: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PopModalService {
  modalSubject$: BehaviorSubject<ModalType>;
  constructor() {
    /* MODAL FOR ERROR ON SIGN IN / SIGN UP */
    this.modalSubject$ = new BehaviorSubject<ModalType>(ModalType.NONE);

    /* ADDING SCHED MODAL */
    this.addList = new BehaviorSubject<boolean>(false);

    /* UPDATE SCHED MODAL */
    this.updateList = new BehaviorSubject<boolean>(false);

    /* DELETE / UPDATE CONFIRMATION MODAL */
    this.confirmModalStatus$ = new BehaviorSubject<boolean>(false);

    /* ADD TASK MODAL */
    this.addTaskModal$ = new BehaviorSubject<updateMode>({
      mode: false,
      isOpen: false,
    });
  }

  /* ---------MODAL FOR ERROR ON SIGN IN / SIGN UP------- */
  public openModal = (modalType: ModalType) => {
    this.modalSubject$.next(modalType);
  };

  public closeModal = () => {
    this.modalSubject$.next(ModalType.NONE);
  };

  public getModalStatus = () => {
    return this.modalSubject$.asObservable();
  };

  /* --------------- END ---------------------- */

  /* --------- ADD SCHED COMPONENT MODAL ------------- */

  private addList: BehaviorSubject<boolean>;

  public addListModal = (value: boolean) => {
    this.addList.next(value);
  };

  public addList$ = () => {
    return this.addList.asObservable();
  };
  /* --------------- END ---------------------- */

  /* -------- UPDATE SCHED COMPONENT MODAL */

  private updateList: BehaviorSubject<boolean>;

  public isModalOpen = (value: boolean) => {
    this.updateList.next(value);
  };

  public updateList$ = () => {
    return this.updateList.asObservable();
  };

  /* --------------- END ---------------------- */

  /* OPEN OR CLOSE CONFIRMATION MODAL */

  private confirmModalStatus$: BehaviorSubject<boolean>;

  public setConfirmaModalStatus = (value: boolean) => {
    this.confirmModalStatus$.next(value);
  };

  public getConfirmModalStatus = () => {
    return this.confirmModalStatus$.asObservable();
  };

  /* --------------- END ---------------------- */

  /* CONFIRMATION RESPONSE MODAL */

  private confirmationModal$: Subject<boolean> = new Subject<boolean>();

  public getConfirmationModal = () => {
    return this.confirmationModal$.asObservable();
  };

  public sendValueModal = (value: boolean) => {
    this.confirmationModal$.next(value);
  };

  /* --------------- END ---------------------- */

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  /* --------------- ADD TASK MODAL ---------------------- */

  private addTaskModal$: BehaviorSubject<updateMode>;

  public getAddTaskModalStatus = () => {
    return this.addTaskModal$.asObservable();
  };

  public changeAddTaskModalStatus = (status: updateMode) => {
    this.addTaskModal$.next(status);
  };

  /* --------------- END ---------------------- */
}
