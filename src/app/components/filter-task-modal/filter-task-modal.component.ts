import { Component, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { FilterTaskService } from '../../database/filter-task.service';
import { TaskObservableService } from '../../service/task-observable.service';
import { PriorityService } from '../../service/priority.service';
import { PopModalService } from '../../service/pop-modal.service';

@Component({
  selector: 'app-filter-task-modal',
  templateUrl: './filter-task-modal.component.html',
  styleUrl: './filter-task-modal.component.scss',
})
export class FilterTaskModalComponent implements OnDestroy {
  constructor(
    private filterTask: FilterTaskService,
    private task$: TaskObservableService,
    private level: PriorityService,
    private popModal: PopModalService
  ) {}
  public destroySubs$: Subject<boolean> = new Subject<boolean>();

  public getTaskByDueDate = () => {
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
  public getTaskByPriorities = () => {
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

  public closeTaskFilter = () => {
    this.popModal.setTaskFilterSignal(false);
  };

  ngOnDestroy(): void {
    this.destroySubs$.next(true);
    this.destroySubs$.complete();
  }
}
