import { Injectable, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, Task } from './db';
import { Observable, from, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PriorityService } from '../service/priority.service';
import { taskService } from './task.service';
import { ScheduleService } from './schedule.service';

@Injectable({
  providedIn: 'root',
})
export class FilterTaskService extends taskService {
  allTaskByStatus$: Observable<Task[]>;
  allTaskByDueDateToday$: Observable<Task[]>;
  /* allTaskByPriorities$: Observable<Task[]>; */

  constructor(
    datePipe: DatePipe,
    sortDate: ScheduleService,
    private level: PriorityService
  ) {
    super(datePipe, sortDate);
    /* ----------- QUERY FETCH data from DB REACTIVELY/ ON LIVE */
    this.allTaskByStatus$ = from(liveQuery(() => this.getTaskByStatus()));
    this.allTaskByDueDateToday$ = from(
      liveQuery(() => this.getTaskByDueDate())
    );

    /* this.allTaskByPriorities$ = this.getTaskbyPriorityStatus(); */
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

  /* FETCHING ALL TASK BASED ON PRIORITY AND STATUS */
  public getTaskbyPriorityStatus = () => {
    this.taskList$ = this.level
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
    console.log(result);

    return result;
  };
}
