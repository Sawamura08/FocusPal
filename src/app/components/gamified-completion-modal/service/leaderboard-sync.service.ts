import { DestroyRef, inject, Injectable } from '@angular/core';
import { updateRequest } from '../../../views/leaderboards/model/leaderboardClass';
import { userGameData } from '../../../interfaces/game.interface';
import { db, User } from '../../../database/db';
import { LeaderboardsService } from '../../../service/leaderboards.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameUserDataService } from '../../../database/game-user-data.service';
import { ResponseService } from '../../../service/reponse.service';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardSyncService {
  constructor(
    protected leader: LeaderboardsService,
    protected gameData: GameUserDataService,
    protected response: ResponseService
  ) {}

  private destroyRef = inject(DestroyRef);
  public updateUserData = async (data: userGameData) => {
    const result = await this.fetchUsername(data.userId);

    if (result != undefined) {
      const updatedData: updateRequest = {
        id: data.userId,
        points: data.currentExp,
        profile: `${data.avatarID}.png`,
        userName: result.userName,
      };

      this.leader
        .updateUserData(updatedData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          console.log(value);
          if (value != undefined && value.id != undefined) {
            this.changeUpdateStatus(data);
          }
        });
    }
  };

  public fetchUsername = async (userid: number) => {
    try {
      const number = await db.userList.where('userId').equals(userid).first();

      return number;
    } catch {
      console.error('Error Fetching username');
      return undefined;
    }
  };

  public changeUpdateStatus = async (data: userGameData) => {
    const UPDATED = 1;
    data.isUpdated = UPDATED;
    const result = await this.gameData.updateUserData(data);
  };

  public checkUpdateStatus = async (userId: number) => {
    try {
      const result = await db.userGameInfo
        .where('userId')
        .equals(userId)
        .first();
      return this.response.successResponse(result);
    } catch {
      return this.response.errorResponse();
    }
  };
}
