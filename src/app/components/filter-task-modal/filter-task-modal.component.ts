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

    /* FETCH TASK FILTER VALUES */
    this.setTaskFilterOnInit();
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
    console.log(filter.value);

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
    /* STOP THE SUBSCRIBE ON THE FILTER */
    this.task$.destroySubs$.next(true);

    /* SET THE USER CHOICE FILTER INTO UNDEFINED */
    this.task$.setUserTaskFilter(undefined);

    /* PUT A REST VALUE FOR UI HERE */
  };

  /* ----------------- END ----------------- */

  // public getTaskByDueDate = () => {
  //   this.filterTask.allTaskByDueDate$
  //     .pipe(takeUntil(this.destroySubs$))
  //     .subscribe({
  //       next: (value: any) => {
  //         this.task$.setNewTaskList(value);
  //       },
  //       error: (err) => {
  //         console.error('Failed to Fetch Task', err);
  //       },
  //     });
  // };

  // /* FETCH TASK DEPENDING ON PRIORITIES */
  // public getTaskByPriorities = () => {
  //   this.destroySubs$.next(true);
  //   this.level.changePriority(0);

  //   this.filterTask.allTaskByPriorities$
  //     .pipe(takeUntil(this.destroySubs$))
  //     .subscribe({
  //       next: (value: any) => {
  //         this.task$.setNewTaskList(value);
  //       },
  //       error: (err) => {
  //         console.error('Failed to Fetch Task', err);
  //       },
  //     });
  // };

  public closeTaskFilter = () => {
    this.popModal.setTaskFilterSignal(false);
  };

  public setTaskFilterOnInit = () => {
    this.task$
      .getUserTaskFilter()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error on Subscribe Task Observable', err);
          return of([]);
        })
      )
      .subscribe({
        next: (value) => {
          this.userInput.patchValue(value!);
          this.syncFiltertoUI(value);
        },
      });
  };

  public syncFiltertoUI = (value: any) => {
    if (value) {
      this.formNameList['category'] = value.category;
      this.formNameList['tags'] = value.tags;
      this.formNameList['status'] = value.status;
      this.formNameList['priority'] = value.priority;
    }
  };

  /* ----------- END ----------- */

  /* ------------SETTING FORM VALUE ---------------- */
  public categoryChoices = categories;
  public formNameList: { [key: string]: number | undefined } = {
    category: undefined,
    tags: undefined,
    status: undefined,
    priority: undefined,
  };
  // all field use one method for setting values
  public setFormValues = (choice: number, fieldName: string | undefined) => {
    if (this.formNameList[fieldName!] === choice) {
      fieldName = undefined;
      this.setValueOnChange(null, fieldName!);
    } else {
      this.formNameList[fieldName!] = choice;

      this.setValueOnChange(choice, fieldName!);
    }
  };

  /* ----------- END ----------- */

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
