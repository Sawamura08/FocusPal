import { computed, Injectable, signal } from '@angular/core';
import { modalStatus } from '../../../Objects/modal.details';
import { userGameData } from '../../../interfaces/game.interface';

@Injectable({
  providedIn: 'root',
})
export class GamifiedCompletionService {
  constructor() {}

  /* OPENING AND CLOSING THE MODAL */
  public completionModalStatus = signal<boolean>(modalStatus.close);

  public setCompletionModalStatus = (value: boolean) => {
    this.completionModalStatus.set(value);
  };

  public getCompletionModalStatus = () => {
    return this.completionModalStatus;
  };

  /* ---------- END ------------- */

  /* COMPLEETION DATA VALUE */
  public completionModalValue = signal<userGameData | undefined>(undefined);

  public setCompletionModalValue = (userData: userGameData) => {
    this.completionModalValue.set(userData);
  };

  public getCompletionModalValue = () => {
    return this.completionModalValue;
  };
}
