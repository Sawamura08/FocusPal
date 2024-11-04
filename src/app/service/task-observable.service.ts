import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../database/db';

@Injectable({
  providedIn: 'root',
})
export class TaskObservableService {
  constructor() {}

  protected taskListObservable: BehaviorSubject<Task[]> = new BehaviorSubject<
    Task[]
  >([]);

  public setNewTaskList = (taskList: Task[]) => {
    this.taskListObservable.next(taskList);
  };

  public getTaskList = (): Observable<Task[]> => {
    return this.taskListObservable.asObservable();
  };
}
