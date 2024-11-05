import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../database/db';
import { taskFilter } from '../interfaces/Request';

@Injectable({
  providedIn: 'root',
})
export class TaskObservableService {
  constructor() {}

  /* TASK LIST */
  protected taskListObservable: BehaviorSubject<Task[]> = new BehaviorSubject<
    Task[]
  >([]);

  /* CHOICES OF USER TO FILTER THE TASK LIST */
  protected userTaskFilter$: BehaviorSubject<taskFilter | undefined> =
    new BehaviorSubject<taskFilter | undefined>(undefined);

  public setNewTaskList = (taskList: Task[]) => {
    this.taskListObservable.next(taskList);
  };

  public getTaskList = (): Observable<Task[]> => {
    return this.taskListObservable.asObservable();
  };

  /* ------------------------------------------------------- */
  public setUserTaskFilter = (filter: taskFilter) => {
    this.userTaskFilter$.next(filter);
  };

  public getUserTaskFilter = (): Observable<taskFilter | undefined> => {
    return this.userTaskFilter$.asObservable();
  };
}
