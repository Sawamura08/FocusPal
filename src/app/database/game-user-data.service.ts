import { Injectable } from '@angular/core';
import { db } from './db';
import { userGameData } from '../interfaces/game.interface';
import { fetchResponse } from '../interfaces/fetch-response';
import { ErrorResponse } from '../interfaces/error-response';
import { ResponseService } from '../service/reponse.service';

@Injectable({
  providedIn: 'root',
})
export class GameUserDataService {
  constructor(protected response: ResponseService) {}

  /* INSERT */
  public insertNewUser = async () => {
    const newData: userGameData = {
      userId: 52,
      rank: 1,
      currentExp: 10,
      nextLevelExp: 200,
      avatarID: 0,
    };

    try {
      const id = await db.userGameInfo.add(newData);
      const response: fetchResponse = { value: id, status: true };
      return response;
    } catch {
      const erorResult: ErrorResponse = {
        success: false,
        message: 'Error Inserting new Value',
        value: false,
      };
      return erorResult;
    }
  };

  /* FETCH */
  public fetchUserByID = async (userId: number) => {
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

  /* UPDATE */
  public updateUserData = async (userData: userGameData) => {
    try {
      const key = userData.userGameData;
      const result = await db.userGameInfo.update(key!, userData);

      return this.response.successResponse(result);
    } catch {
      return this.response.errorResponse();
    }
  };
}
