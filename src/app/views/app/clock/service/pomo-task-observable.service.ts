import { Injectable, signal } from '@angular/core';
import { modalStatus } from '../../../../Objects/modal.details';
import { pomoTask } from '../../../../interfaces/pomoPal';

@Injectable({
  providedIn: 'root',
})
export class PomoTaskObservableService {
  constructor() {}

  public taskPomodoroModalSignal = signal<boolean>(modalStatus.close);

  public setPomodoroModalStatus = (status: boolean) => {
    this.taskPomodoroModalSignal.set(status);
  };

  public getPomodoroModalStatus = () => {
    return this.taskPomodoroModalSignal;
  };

  /* SET TASK AS SIGNAL */
  public taskPomodoroModalValue = signal<pomoTask | undefined>(undefined);

  public setPomodoroModalValue = (status: pomoTask | undefined) => {
    this.taskPomodoroModalValue.set(status);
  };

  public getPomodoroModalValue = () => {
    return this.taskPomodoroModalValue;
  };
}
