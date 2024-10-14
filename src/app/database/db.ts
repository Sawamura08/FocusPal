import Dexie, { Table } from 'dexie';

export interface Task {
  taskId?: number;
  userId: number;
  description: string;
  subTask?: string; // it should be array string
  status: number;
  priority: number;
  dueDate: Date;
  createdAt: Date;

  isSync: number;
  isUpdated: number;
  isQueued: number;
}

export interface User {
  userId: number;
  userName: string;
}

export interface Schedule {
  schedId?: number;
  userId: number;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  repeat: number; // 0 - NONE; 1- DAILY; 2- CUSTOM
  type: number; // 0 - CLASS; 1 - MEETING; 2- FAMILY/FRIENDS; 3- Others
  isActive: number; // 0 - inactive; 1 - active
  daysOfWeek?: Array<number>;
  location: string; // SET room number for class
}

export class localDB extends Dexie {
  taskList!: Table<Task, number>;
  userList!: Table<User, number>;
  schedList!: Table<Schedule, number>;

  constructor() {
    super('myDB');
    this.version(23).stores({
      taskList:
        '++taskId, userId,description,subTask, status, priority, dueDate, createdAt, isSync, isUpdated,isQueued',
      userList: 'userId,userName',
      schedList:
        '++schedId,userId,title,date,startTime,endTime,repeat,type,isActive,daysOfWeek,location',
    });
  }
}

export const db = new localDB();
