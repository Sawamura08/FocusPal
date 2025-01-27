import { DestroyRef, inject, Injectable, OnInit, VERSION } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, Task, User } from './db';
import {
  Observable,
  distinctUntilChanged,
  from,
  switchMap,
  throttleTime,
} from 'rxjs';
import Dexie, { Table } from 'dexie';
import { DatePipe } from '@angular/common';
import { ScheduleService } from './schedule.service';
import { TaskObservableService } from '../service/task-observable.service';
import { taskCompletion } from '../interfaces/export.object';
import { SubTaskService } from './sub-task.service';
import { ResponseService } from '../service/reponse.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { taskFilter } from '../interfaces/Request';

@Injectable({
  providedIn: 'root',
})
export class taskService {
  public taskList$: Observable<Task[]>;
  userList$: Observable<User[]>;
  public destroyRef = inject(DestroyRef);

  constructor(
    protected datePipe: DatePipe,
    protected sortDate: ScheduleService,
    protected task$: TaskObservableService,
    protected subTasks: SubTaskService,
    protected Response: ResponseService
  ) {
    /* ----------- QUERY FETCH data from DB REACTIVELY/ ON LIVE */
    this.taskList$ = from(liveQuery(() => this.getAllTask()));
    this.userList$ = from(liveQuery(() => db.userList.toArray()));
    this.getTaskList();
  }

  /* GET ALL TASK */
  public filterData: taskFilter | undefined;
  public getTaskList = () => {
    this.task$
      .getUserTaskFilter()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => {
          this.filterData = value;
        },
        error: (err) => console.log('Error fetching filters', err),
      });
  };

  public getAllTask = async () => {
    const progress = this.task$.getTaskProgressFilter()();

    const sched = await db.taskList
      .where('status')
      .equals(progress)
      .sortBy('dueDate');
    if (this.filterData != undefined) {
      const updatedSched = sched.filter(
        (schedData) =>
          (this.filterData?.priority === null ||
            schedData.priority === this.filterData!.priority) &&
          (this.filterData?.category === null ||
            schedData.taskCategory === this.filterData!.category) &&
          (this.filterData?.tags === null ||
            schedData.tags === this.filterData!.tags)
      );

      this.task$.setNewTaskList(updatedSched);
      return updatedSched;
    } else {
      this.task$.setNewTaskList(sched);
      return sched;
    }
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
      subTasks: userInputs.subTasks,
      priority: userInputs.priority,
      startDate: userInputs.startDate,
      dueDate: userInputs.dueDate,
      dueTime: userInputs.dueTime,
      createdAt: new Date(currentDate!),
      taskCategory: userInputs.taskCategory,
      tags: userInputs.tags,
      completeAnimationStatus: false,

      isSync: 0,
      isUpdated: 0,
      isQueued: 0,
    };
    try {
      const taskId = await db.taskList.add(newTask);

      /* IF INSERT TASK IS SUCCESS AND THERE IS A SUBTASKS */
      if (taskId && newTask.subTasks?.length != 0) {
        this.subTasks.insertSubTask(newTask);
      }
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

  public setTaskCompletetionStatus = async (task: Task) => {
    try {
      const result = await db.taskList.update(task.taskId!, task);
      return this.Response.successResponse(result, task.status);
    } catch {
      return this.Response.errorResponse();
    }
  };

  /* SET TASK PAST DUE */

  public fetchUnfinishedTask = async () => {
    const pending = taskCompletion.PENDING;
    const currentDate = new Date().getTime();

    try {
      const result = await db.taskList
        .where('status')
        .equals(pending)
        .toArray();
      /* FILTER TO GET THE PAST DUE TASK */
      const unFinishedTask = result.filter((task) => {
        const exactDueDateTime = this.getExactDueDateTime(
          task.dueDate,
          task.dueTime
        );
        return currentDate > exactDueDateTime;
      });

      return this.setTaskPastDueStatus(unFinishedTask);
    } catch {
      console.log('Error Fetching task due Date');
      return [];
    }
  };

  /* GET THE EXACT TIME OF THE DUE DATE AND TIME*/
  /* ADD DUE TIME AND DUE DATE */
  public getExactDueDateTime = (dueDate: Date, dueTime: Date) => {
    const dueDateMilliseconds = dueDate.getTime();
    /* EXTRACT THE TIME ONTO THE DUE TIME */
    const hours = dueTime.getHours();
    const minutes = dueTime.getMinutes();
    const seconds = dueTime.getSeconds();
    const dueTimeInMilliseconds =
      (hours * 3600 + minutes * 60 + seconds) * 1000;

    /* ADD THE DUE TIME AND DATETIME */
    const exactDueDateTime = dueDateMilliseconds + dueTimeInMilliseconds;
    return exactDueDateTime;
  };

  /* UPDATE TASK TO PAST DUE */
  public setTaskPastDueStatus = async (unfinishedTask: Task[]) => {
    unfinishedTask.map((task) => {
      /* copy the object */
      let copyTask = { ...task };
      // change the value
      copyTask.status = taskCompletion.PAST_DUE;
      const udpatedTask = copyTask;
      try {
        db.taskList.update(task.taskId!, udpatedTask);
      } finally {
        return copyTask;
      }
    });
  };

  /* FETCH TASK BY ID */
  public fetchAllTaskByID = async (id: number) => {
    try {
      const result = await db.taskList.where('userId').equals(id).toArray();
      return this.Response.successResponse(result);
    } catch {
      return this.Response.errorResponse();
    }
  };

  /* FETCH TASK PENDING AND COMPLETED */
  public fetchTaskTracker = async (id: number) => {
    try {
      const result = await db.taskList.where('userId').equals(id).toArray();

      const pendingAndCompletedTask = result.filter((task) => {
        return task.status === 0 || task.status === 2 ? true : false;
      });
      return pendingAndCompletedTask;
    } catch {
      return this.Response.errorResponse();
    }
  };
}
