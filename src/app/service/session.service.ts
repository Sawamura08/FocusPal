import { Injectable, signal } from '@angular/core';
import { db, User } from '../database/db';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {
    this.fetchUserInfo();
  }

  private session$ = new BehaviorSubject<User | undefined>(undefined);

  /* CREATE A SESSION FOR THE USER */
  public addUser = async (user: User) => {
    try {
      const newUser = {
        userId: user.userId,
        userName: user.userName,
      };
      await db.userList.add(newUser);
      this.session$.next(newUser);
    } catch (err) {
      console.error('Error creating User', err);
    }
  };

  public fetchUserInfo = async () => {
    const list = await db.userList.toArray();
    if (list && list[0]) {
      this.session$.next(list[0]);
    }
  };

  public fetchUserId = async (): Promise<number | undefined> => {
    try {
      const id = await db.userList.toArray();
      const userId = id != null ? id[0].userId : undefined;
      return userId;
    } catch (err) {
      console.error('Error on Fetching userId', err);
      return undefined;
    }
  };
  /* GET THE ID OF THE LOGGED USER */
  public getUser = () => {
    return this.session$.asObservable();
  };
}
