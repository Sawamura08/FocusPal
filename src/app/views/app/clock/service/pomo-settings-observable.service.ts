import { Injectable, Signal, signal } from '@angular/core';
import { modalStatus } from '../../../../Objects/modal.details';

@Injectable({
  providedIn: 'root',
})
export class PomoSettingsObservableService {
  constructor() {}

  public pomoSettingsModalStatus = signal<boolean>(modalStatus.close);

  public setSettingsModalStatus = (status: boolean) => {
    this.pomoSettingsModalStatus.set(status);
  };

  public getSettingsModalStatus = (): Signal<boolean> => {
    return this.pomoSettingsModalStatus;
  };
}
