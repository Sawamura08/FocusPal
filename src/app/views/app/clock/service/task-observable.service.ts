import { Injectable, signal } from '@angular/core';
import { modalStatus } from '../../../../Objects/modal.details';

@Injectable({
  providedIn: 'root',
})
export class TaskObservableService {
  constructor() {}

  taskPomodoroModalSignal = signal<boolean>(modalStatus.close);

  public setPomodoroModalStatus = (status: boolean) => {
    this.taskPomodoroModalSignal.set(status);
  };

  public getPomodoroModalStatus = () => {
    return this.taskPomodoroModalSignal;
  };
}
