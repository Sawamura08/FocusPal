import { Injectable, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, Task } from './db';
import { Observable, from, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PriorityService } from '../service/priority.service';

@Injectable({
  providedIn: 'root',
})
export class FilterTaskService {
  allTaskByStatus$: Observable<Task[]>;
  allTaskByDueDateToday$: Observable<Task[]>;
  allTaskByPriorities$: Observable<Task[]>;

  constructor(private datePipe: DatePipe, private level: PriorityService) {
    /* ----------- QUERY FETCH data from DB REACTIVELY/ ON LIVE */
    this.allTaskByStatus$ = from(liveQuery(() => this.getTaskByStatus()));
    this.allTaskByDueDateToday$ = from(
      liveQuery(() => this.getTaskByDueDate())
    );

    this.allTaskByPriorities$ = this.observePriorityLevelTasks();
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
    return task.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  };

  /* FETCHING ALL TASK BASED ON PRIORITY AND STATUS */
  public observePriorityLevelTasks = () => {
    return this.level
      .priorityLevel$()
      .pipe(
        switchMap((level: number) =>
          from(liveQuery(() => this.getTaskByPriority(level)))
        )
      );
  };
  public getTaskByPriority = async (level: number): Promise<Task[]> => {
    return await db.taskList
      .where('status')
      .equals(0)
      .and((task) => task.priority === level)
      .and((task) => task.userId === 38)
      .toArray();
  };
}
