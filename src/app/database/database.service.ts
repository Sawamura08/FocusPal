import { Injectable } from '@angular/core';

const DB_USERS = 'myuserdb';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {}
