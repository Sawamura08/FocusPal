import { Injectable } from '@angular/core';
import { db } from '../../../../database/db';
import { ResponseService } from '../../../../service/reponse.service';
import { userPomoConfig } from '../../../../interfaces/pomoPal';
import { from, Observable, switchMap } from 'rxjs';
import { liveQuery } from 'dexie';
import { SessionService } from '../../../../service/session.service';

@Injectable({
  providedIn: 'root',
})
export class PomoTaskConfigService {
  public userConfig$: Observable<userPomoConfig | undefined>;
  constructor(
    protected response: ResponseService,
    protected session: SessionService
  ) {
    this.userConfig$ = this.observableUserId();
  }

  public observableUserId = (): Observable<userPomoConfig | undefined> => {
    return this.session
      .getUser()
      .pipe(
        switchMap((user) =>
          from(liveQuery(() => this.fetchUserConfigById(user?.userId!)))
        )
      );
  };

  public fetchUserConfigById = async (id: number) => {
    const result = await db.userPomoConfigList
      .where('userId')
      .equals(id)
      .first();

    return result;
  };

  public insertUserConfig = async (data: userPomoConfig) => {
    try {
      const result = await db.userPomoConfigList.add(data);
      return this.response.successResponse(result);
    } catch {
      return this.response.errorResponse();
    }
  };

  public updateUserConfig = async (
    key: number,
    updatedData: userPomoConfig
  ) => {
    try {
      const result = await db.userPomoConfigList.update(key, updatedData);

      return this.response.successResponse(result, updatedData);
    } catch {
      return this.response.errorResponse();
    }
  };
}
