import { Injectable } from '@angular/core';
import { db, User } from '../database/db';
import { fetchResponse } from '../interfaces/fetch-response';

@Injectable({
  providedIn: 'root',
})
export class FetchHomeDataService {
  constructor() {}

  public getUsername = async (): Promise<fetchResponse> => {
    try {
      const username = await db.userList.get(1);
      if (username) {
        return { value: username, status: true };
      } else {
        return { response: 'Failed Fetch', status: false };
      }
    } catch (err) {
      console.log('Error Fetching username', err);
      return { response: 'Error Fetching username', status: false, error: err };
    }
  };
}