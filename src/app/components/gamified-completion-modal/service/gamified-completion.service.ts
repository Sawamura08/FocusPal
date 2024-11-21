import { computed, Injectable, signal } from '@angular/core';
import { modalStatus } from '../../../Objects/modal.details';

@Injectable({
  providedIn: 'root',
})
export class GamifiedCompletionService {
  constructor() {}

  /* OPENING AND CLOSING THE MODAL */
  public completionModalStatus = signal<boolean>(modalStatus.open);
  public newCompletionModalStatus = computed(() =>
    this.completionModalStatus()
  );

  public setCompletionModalStatus = (value: boolean) => {
    this.completionModalStatus.set(value);
  };

  public getCompletionModalStatus = () => {
    return this.completionModalStatus;
  };

  /* ---------- END ------------- */
}
