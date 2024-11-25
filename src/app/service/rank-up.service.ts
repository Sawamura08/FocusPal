import { computed, Injectable, signal } from '@angular/core';
import { modalStatus } from '../Objects/modal.details';
import { userGameData } from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root',
})
export class RankUpService {
  constructor() {}

  public rankUpModalStatus = signal<boolean>(modalStatus.close);
  public setRankUpModalStatus = (status: boolean) => {
    this.rankUpModalStatus.set(status);
  };

  public getRankUpModalStatus = () => {
    return this.rankUpModalStatus;
  };

  /* FETCHING DATA */

  public rankUpModalData = signal<userGameData | undefined>(undefined);
  public setRankUpModalData = (data: userGameData) => {
    this.rankUpModalData.set(data);
  };

  public getRankUpModalData = () => {
    return this.rankUpModalData;
  };
}
