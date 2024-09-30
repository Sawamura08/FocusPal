import { Injectable } from '@angular/core';
import { db, User } from '../database/db';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  /* CREATE A SESSION FOR THE USER */
  public addUser = async (user: User) => {
    try {
      const newUser = {
        userId: user.userId,
        userName: user.userName,
      };
      await db.userList.add(newUser);
    } catch (err) {
      console.error('Error creating User', err);
    }
  };

  /* GET THE ID OF THE LOGGED USER */
  public getUser = async () => {
    const idNumber = await db.userList.toArray();

    return idNumber[0].userId;
  };
}
