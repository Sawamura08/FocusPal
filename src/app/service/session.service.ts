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
  private session = signal<User>({ userId: 0, userName: '' });

  /* CREATE A SESSION FOR THE USER */
  public addUser = async (user: User) => {
    try {
      const newUser = {
        userId: user.userId,
        userName: user.userName,
      };
      await db.userList.add(newUser);
      this.session.set(newUser);
    } catch (err) {
      console.error('Error creating User', err);
    }
  };

  public fetchUserInfo = async () => {
    const list = await db.userList.toArray();
    this.session.set(list[0]);
  };

  /* GET THE ID OF THE LOGGED USER */
  public getUser = () => {
    return this.session;
  };
}
