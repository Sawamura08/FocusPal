import { Injectable } from '@angular/core';
import { db } from './db';
import { pomoTask } from '../interfaces/pomoPal';
import { ResponseService } from '../service/reponse.service';
import { taskCompletion } from '../interfaces/export.object';
import { from, Observable } from 'rxjs';
import { liveQuery } from 'dexie';

@Injectable({
  providedIn: 'root',
})
export class PomodoroTaskService {
  constructor(protected response: ResponseService) {
    this.taskList$ = from(liveQuery(() => this.fetchTask()));
  }

  public taskList$: Observable<pomoTask[]>;
  public fetchTask = () => {
    try {
      const task = db.pomoTaskList
        .where('status')
        .equals(taskCompletion.PENDING)
        .toArray();

      return task;
    } catch {
      return [];
    }
  };

  public insertTask = async (task: pomoTask) => {
    try {
      const result = await db.pomoTaskList.add(task);

      return this.response.successResponse(result);
    } catch {
      return this.response.errorResponse();
    }
  };

  public updateTask = async (key: number, task: pomoTask) => {
    try {
      const result = await db.pomoTaskList.update(key, task);
      return this.response.successResponse(result, task);
    } catch {
      return this.response.errorResponse();
    }
  };

  public deleteTask = async (key: number) => {
    const result = await db.pomoTaskList.delete(key);
  };

  /* ACTION DURING TIMER */
}
