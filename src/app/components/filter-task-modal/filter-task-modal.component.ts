import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { catchError, EMPTY, of, Subject, takeUntil } from 'rxjs';
import { FilterTaskService } from '../../database/filter-task.service';
import { TaskObservableService } from '../../service/task-observable.service';
import { PriorityService } from '../../service/priority.service';
import { PopModalService } from '../../service/pop-modal.service';
import { AddTaskInput } from '../../class/add-task-input';
import { FormGroup, Validators } from '@angular/forms';
import { categories } from '../../interfaces/export.object';
import { FormBuilder } from '@angular/forms';
import { taskFilter } from '../../interfaces/Request';
import { SessionService } from '../../service/session.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filter-task-modal',
  templateUrl: './filter-task-modal.component.html',
  styleUrl: './filter-task-modal.component.scss',
})
export class FilterTaskModalComponent
  extends AddTaskInput
  implements OnDestroy, OnInit
{
  constructor(
    private filterTask: FilterTaskService,
    private task$: TaskObservableService,
    private level: PriorityService,
    private popModal: PopModalService,
    private session: SessionService
  ) {
    /* needs to call the component itself before the status method */
    super(FilterTaskModalComponent.createFormGroup());

    /* put the method result into the filter to access the formGroup */
    /* I didn't use this just a note how to call a static method/variables */
    this.filterInput = FilterTaskModalComponent.createFormGroup();
  }

  ngOnInit(): void {
    /* FETCH USER ID */
    this.getId();
  }
  public destroyRef = inject(DestroyRef);
  public destroySubs$: Subject<boolean> = new Subject<boolean>();
  public filterInput!: FormGroup;
  public taskFilter: taskFilter | undefined = undefined;

  /* ----------------- FORMS ----------------- */
  /* created a status method to call this function without 'this' */
  public static createFormGroup = (): FormGroup => {
    const fb = new FormBuilder();
    const filterInput = fb.group({
      userId: ['', Validators.required],
      category: [null],
      tags: [null],
      status: [null],
      priority: [null],
    });

    return filterInput;
  };

  public apply = () => {
    const filter = this.userInput;

    /* REMOVE THE PREVIOUS SUBSCRIPTION */
    this.task$.destroySubs$.next(true);

    if (filter.valid) {
      this.task$.setUserTaskFilter(filter.value);
      this.filterTask.filteredTask$
        .pipe(
          takeUntil(this.task$.destroySubs$),
          catchError((err) => {
            console.error('Error, Fetching Filtered Task', err);
            return of([]);
          })
        )
        .subscribe({
          next: (value) => {
            this.task$.setNewTaskList(value);
            //this.closeTaskFilter();
          },
        });
    }
  };

  public resetFilter = () => {
    this.task$.setNewTaskList([]);
  };

  /* ----------------- END ----------------- */

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

  /* ----------- SETTING FORM VALUES ----------- */

  // CATEGORY
  public categoryChoices = categories;
  public formNameList: { [key: string]: number } = {
    category: 0,
    tags: 0,
    status: 0,
    priority: 0,
  };
  public categoryChoiceIndex: number | undefined = undefined;

  public setCategoryChoice = (choice: number) => {
    if (this.categoryChoiceIndex === choice) {
      this.categoryChoiceIndex = undefined;
      this.setValueOnChange(null, 'category');
    } else {
      this.categoryChoiceIndex = choice;

      this.setValueOnChange(choice, 'category');
    }
  };

  public setFormValues = (
    choice: number,
    formName: string,
    choiceIndex: string
  ) => {
    console.log(this.formNameList[choiceIndex]);
    /* if (this.formNameList[choiceIndex] === choice) {
      choiceIndex = undefined;
      this.setValueOnChange(null, formName);
    } else {
      choiceIndex = choice;

      this.setValueOnChange(choice, formName);
    } */
  };

  // TAGS
  public tagChoiceIndex: number | undefined = undefined;

  public setTagIndex = (choice: number) => {
    this.tagChoiceIndex = choice;

    this.setValueOnChange(choice, 'tags');
  };

  // STATUS

  public statusChoiceIndex: number | undefined = undefined;

  public setStatusIndex = (choice: number) => {
    this.statusChoiceIndex = choice;

    this.setValueOnChange(choice, 'status');
  };

  // PRIORITY

  public priorityChoiceIndex: number | undefined = undefined;

  public setPriorityIndex = (choice: number) => {
    this.priorityChoiceIndex = choice;

    this.setValueOnChange(choice, 'priority');
  };

  /* GET SESSION FOR USER */
  public static userId: number | undefined = undefined;
  public getId = () => {
    this.session
      .getUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error on fetching userInfo', err);
          return of(undefined);
        })
      )
      .subscribe({
        next: (value) => {
          FilterTaskModalComponent.userId = value?.userId;
          this.setValueOnChange(FilterTaskModalComponent.userId!, 'userId');
        },
      });
  };
  /* END */

  /* ----------- END ----------- */

  ngOnDestroy(): void {
    this.destroySubs$.next(true);
    this.destroySubs$.complete();
  }
}
