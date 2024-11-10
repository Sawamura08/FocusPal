import { computed, Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
  public setUserTaskFilter = (filter: taskFilter | undefined) => {
    this.userTaskFilter$.next(filter);
  };

  public getUserTaskFilter = (): Observable<taskFilter | undefined> => {
    return this.userTaskFilter$.asObservable();
  };

  /* SUBJECT FOR PREVENTING MULTIPLE SUBSCRIPTION */

  public destroySubs$: Subject<boolean> = new Subject<boolean>();

  /* SIGNAL FOR SETTING DATA FOR UPDATE AND DELETE*/
  public taskDataSignal = signal<Task | undefined>(undefined);
  public updatedTaskDataSignal = computed(() => this.taskDataSignal());

  public setTaskDataValue = (data: Task) => {
    this.taskDataSignal.set(data);
  };

  public getTaskDataSignal = () => {
    return this.updatedTaskDataSignal;
  };
}
