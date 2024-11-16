import { Injectable, VERSION } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, Task, User } from './db';
import { Observable, from } from 'rxjs';
import Dexie, { Table } from 'dexie';
import { DatePipe } from '@angular/common';
import { ScheduleService } from './schedule.service';
import { TaskObservableService } from '../service/task-observable.service';
import { taskCompletion } from '../interfaces/export.object';

@Injectable({
  providedIn: 'root',
})
export class taskService {
  public taskList$: Observable<Task[]>;
  userList$: Observable<User[]>;

  constructor(
    protected datePipe: DatePipe,
    protected sortDate: ScheduleService,
    protected task$: TaskObservableService
  ) {
    /* ----------- QUERY FETCH data from DB REACTIVELY/ ON LIVE */
    this.taskList$ = from(liveQuery(() => this.getTaskList()));
    this.userList$ = from(liveQuery(() => db.userList.toArray()));
  }

  /* GET ALL TASK */
  public getTaskList = async (): Promise<Task[]> => {
    const progress = this.task$.getTaskProgressFilter()();

    const sched = await db.taskList
      .where('status')
      .equals(progress)
      .sortBy('dueDate');
    this.task$.setNewTaskList(sched);
    return sched;
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
      startDate: userInputs.startDate,
      dueDate: userInputs.dueDate,
      createdAt: new Date(currentDate!),
      taskCategory: userInputs.taskCategory,
      tags: userInputs.tags,

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
  public updateTask = async (update: Task, taskId: number) => {
    const key = taskId;
    return await db.taskList.update(key, update);
  };

  /* DELETE TASK */

  public deleteTask = async (del: number) => {
    await db.taskList.delete(del);
  };

  /* SET TASK COMPLETION */

  public setTaskCompletetionStatus = (isComplete: boolean) => {
    const value = isComplete ? taskCompletion.COMPLETE : taskCompletion.PENDING;

    /*  db.taskList.update() */
  };
}
