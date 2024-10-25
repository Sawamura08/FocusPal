import { Injectable } from '@angular/core';
import { db, User } from '../database/db';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {
    this.session$ = new BehaviorSubject<User>({ userId: 0, userName: '' });
    this.getUser();
  }

  protected session$!: BehaviorSubject<User>;

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

  /* GET THE ID OF THE LOGGED USER */
  public getUser = async () => {
    const list = await db.userList.toArray();
    const userData = {
      userId: list[0].userId,
      userName: list[0].userName,
    };
    if (list) {
      this.session$.next(userData);
    }
    return list[0].userId;
  };

  public fetchUserData = () => {
    return this.session$.asObservable();
  };
}
