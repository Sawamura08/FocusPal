import { Injectable, VERSION } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, Task, User } from './db';
import { Observable, from } from 'rxjs';
import Dexie, { Table } from 'dexie';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  taskList$: Observable<Task[]>;
  userList$: Observable<User[]>;

  constructor(private datePipe: DatePipe) {
    /* ----------- QUERY FETCH data from DB REACTIVELY/ ON LIVE */
    this.taskList$ = from(liveQuery(() => db.taskList.toArray()));
    this.userList$ = from(liveQuery(() => db.userList.toArray()));
  }

  /* GET ALL TASK */
  public getTastList = (): Observable<Task[]> => {
    return this.taskList$;
  };

  /* GET USER SESSION */
  public getUserList = (): Observable<User[]> => {
    return this.userList$;
  };

  /* INSERT NEW TASK */
  public insertTask = async (
    id: number,
    userInputs: Task
  ): Promise<number | null> => {
    const currentDate = this.datePipe.transform(new Date(), 'YYYY-MM-dd HH:mm');
    const newTask: Task = {
      userId: id,
      title: userInputs.title,
      description: userInputs.description,
      status: 0,
      subTask: userInputs.subTask,
      priority: userInputs.priority,
      dueDate: userInputs.dueDate,
      createdAt: new Date(currentDate!),
      taskCategory: userInputs.taskCategory,

      isSync: 0,
      isUpdated: 0,
      isQueued: 0,
    };
    try {
      const taskId = await db.taskList.add(newTask);
      return taskId;
    } catch (err) {
      console.error('Error', err);
      return null;
    }
  };

  /* UPDATE SPECIFIC TASK */
  public updateTask = async (update: Task) => {
    await db.taskList
      .update(1, {
        description: update.description,
        subTask: update.subTask,
        status: update.status,
        priority: update.priority,
        dueDate: update.dueDate,
        createdAt: update.createdAt,
      })
      .then((udpated) => {
        if (udpated) {
          console.log('Success');
        } else {
          console.log('Error');
        }
      });
  };

  /* DELETE TASK */

  public deleteTask = async (del: number) => {
    await db.taskList.delete(del);
  };
}
