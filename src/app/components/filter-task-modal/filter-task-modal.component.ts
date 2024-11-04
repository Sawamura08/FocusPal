import { Component, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { FilterTaskService } from '../../database/filter-task.service';
import { TaskObservableService } from '../../service/task-observable.service';
import { PriorityService } from '../../service/priority.service';

@Component({
  selector: 'app-filter-task-modal',
  templateUrl: './filter-task-modal.component.html',
  styleUrl: './filter-task-modal.component.scss',
})
export class FilterTaskModalComponent implements OnDestroy {
  constructor(
    private filterTask: FilterTaskService,
    private task$: TaskObservableService,
    private level: PriorityService
  ) {}
  public destroySubs$: Subject<boolean> = new Subject<boolean>();

  public getTaskToday = () => {
    this.filterTask.allTaskByDueDate$
      .pipe(takeUntil(this.destroySubs$))
      .subscribe({
        next: (value: any) => {
          this.task$.setNewTaskList(value);
        },
        error: (err) => {
          console.error('Failed to Fetch Task', err);
        },
      });
  };

  /* FETCH TASK DEPENDING ON PRIORITIES */
  public getByPriorities = () => {
    this.destroySubs$.next(true);
    this.level.changePriority(0);

    this.filterTask.allTaskByPriorities$
      .pipe(takeUntil(this.destroySubs$))
      .subscribe({
        next: (value: any) => {
          this.task$.setNewTaskList(value);
        },
        error: (err) => {
          console.error('Failed to Fetch Task', err);
        },
      });
  };

  ngOnDestroy(): void {
    this.destroySubs$.next(true);
    this.destroySubs$.complete();
  }
}
