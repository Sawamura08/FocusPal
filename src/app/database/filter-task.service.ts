import { Injectable, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, Task } from './db';
import { Observable, from, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PriorityService } from '../service/priority.service';
import { taskService } from './task.service';
import { ScheduleService } from './schedule.service';
import { TaskObservableService } from '../service/task-observable.service';
import { taskFilter } from '../interfaces/Request';

@Injectable({
  providedIn: 'root',
})
export class FilterTaskService extends taskService {
  public allTaskByStatus$: Observable<Task[]>;
  public allTaskByDueDate$: Observable<Task[]>;
  public allTaskByPriorities$: Observable<Task[]>;
  public filteredTask$: Observable<Task[]>;

  constructor(
    datePipe: DatePipe,
    sortDate: ScheduleService,
    task$: TaskObservableService,
    private level: PriorityService
  ) {
    super(datePipe, sortDate, task$);
    /* ----------- QUERY FETCH data from DB REACTIVELY/ ON LIVE */
    this.allTaskByStatus$ = from(liveQuery(() => this.getTaskByStatus()));
    this.allTaskByDueDate$ = from(liveQuery(() => this.getTaskByDueDate()));

    this.allTaskByPriorities$ = this.observableTaskPriority();

    this.filteredTask$ = this.observableFilterTask();
  }

  /*  FETCHING ALL TASK BASED ON STATUS */
  public getTaskByStatus = async (): Promise<Task[]> => {
    return await db.taskList.where('status').equals(0).sortBy('dueDate');
  };

  /* FETCHING ALL TASK BASED ON THE DEADLINE TODAY */
  public getTaskByDueDate = async (): Promise<Task[]> => {
    const dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const task = await db.taskList
      .filter((task) => task.dueDate.toISOString().includes(dateToday!))
      .toArray();

    /* SORT BASED ON DUEDATE */
    /* THIS SORT ALL OF THE TASK FIRST UNTIL ALL OF THEM IS SORTED BEFORE RETURNING THE SCHED */
    return task.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  };

  /* FILTER PRIORITY */

  /* FETCHING ALL TASK BASED ON PRIORITY AND STATUS */
  /* SWITCHMAP IS OBSERVABLE */
  public observableTaskPriority = (): Observable<Task[]> => {
    return this.level
      .priorityLevel$()
      .pipe(
        switchMap((level: number) =>
          from(liveQuery(() => this.getTaskByPriority(level)))
        )
      );
  };

  /* GET ALL TASK BY PRIORITY */
  public getTaskByPriority = async (level: number): Promise<Task[]> => {
    const result = await db.taskList
      .where('status')
      .equals(0)
      .and((task) => task.priority === level)
      .toArray();

    return result;
  };

  /* END */

  /* OBSERVABLE FOR FILTERING ALL task DATA */

  public observableFilterTask = (): Observable<Task[]> => {
    return this.task$
      .getUserTaskFilter()
      .pipe(
        switchMap((task) =>
          from(liveQuery(() => this.fetchTaskFiltered(task!)))
        )
      );
  };

  /* END */

  /* GET TASK BASED ON THE USER FILTER CHOICES*/

  public fetchTaskFiltered = async (data: taskFilter): Promise<Task[]> => {
    const progress = this.task$.getTaskProgressFilter()();

    let query = db.taskList.where('userId').equals(data.userId);

    if (data.category !== null) {
      query = query.and((task) => task.taskCategory === data.category);
    }

    if (data.priority !== null) {
      query = query.and((task) => task.priority === data.priority);
    }

    if (data.tags !== null) {
      query = query.and((task) => task.tags === data.tags);
    }

    if (progress !== null) {
      query = query.and((task) => task.status === progress);
    }

    const filteredTask = await query.sortBy('dueDate');

    return filteredTask;
  };

  /* END */
}
