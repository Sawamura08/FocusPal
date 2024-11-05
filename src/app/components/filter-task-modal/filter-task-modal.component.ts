import { Component, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { FilterTaskService } from '../../database/filter-task.service';
import { TaskObservableService } from '../../service/task-observable.service';
import { PriorityService } from '../../service/priority.service';
import { PopModalService } from '../../service/pop-modal.service';
import { AddTaskInput } from '../../class/add-task-input';
import { FormGroup } from '@angular/forms';
import { categories } from '../../interfaces/export.object';

@Component({
  selector: 'app-filter-task-modal',
  templateUrl: './filter-task-modal.component.html',
  styleUrl: './filter-task-modal.component.scss',
})
export class FilterTaskModalComponent
  extends AddTaskInput
  implements OnDestroy
{
  constructor(
    private filterTask: FilterTaskService,
    private task$: TaskObservableService,
    private level: PriorityService,
    private popModal: PopModalService
  ) {
    const formGroup = new FormGroup([]);
    super(formGroup);
  }
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

  public categoryChoices = categories;
  public choiceCategoryIndex: number | undefined = undefined;

  ngOnDestroy(): void {
    this.destroySubs$.next(true);
    this.destroySubs$.complete();
  }
}
