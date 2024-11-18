import Dexie, { Table } from 'dexie';

export interface Task {
  taskId?: number;
  userId: number;
  title: string;
  description?: string;
  subTasks?: Array<{ id: number; data: string }>; // it should be array string
  status: number; // pending OR completed
  priority: number;
  startDate: Date;
  dueDate: Date;
  dueTime: Date;
  createdAt: Date;
  taskCategory: number; // 0 - personal; 1- academic
  tags: number; // the tags is depends on the task category

  isSync: number;
  isUpdated: number;
  isQueued: number;
}

export interface SubTasks {
  subTaskId?: number;
  taskSubtaskId: number; // unique identifier for update and delete OF SUBTASKS
  subTask: string;
  taskId: number;
  status: number;
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
  subTaskList!: Table<SubTasks, number>;

  constructor() {
    super('myDB');
    this.version(30).stores({
      taskList:
        '++taskId, userId, title,description,subTask, status, priority, startDate, dueDate,dueTime , createdAt, taskCategory, tags ,isSync, isUpdated,isQueued',
      userList: 'userId,userName',
      schedList:
        '++schedId,userId,title,date,startTime,endTime,repeat,type,isActive,daysOfWeek,location',
      subTaskList: '++subTaskId,taskSubtaskId,subTask,taskId,status',
    });
  }
}

export const db = new localDB();
