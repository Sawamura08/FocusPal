import { Component, DestroyRef, inject } from '@angular/core';
import { taskService } from '../../../database/task.service';
import { Task } from '../../../database/db';
import { FilterTaskService } from '../../../database/filter-task.service';
import { DatePipe } from '@angular/common';
import { TextPipePipe } from '../../../pipe/text-pipe.pipe';
import { SessionService } from '../../../service/session.service';
import { PriorityService } from '../../../service/priority.service';
import {
  BackgroundSyncService,
  syncType,
} from '../../../service/background-sync.service';
import { NetworkStatusService } from '../../../service/network-status.service';
import { taskRequest } from '../../../interfaces/Request';
import {
  PopModalService,
  updateMode,
} from '../../../service/pop-modal.service';
import { UpdateTaskModeService } from '../../../service/update-task-mode.service';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  constructor(
    private db: taskService,
    private filterDB: FilterTaskService,
    private datePipe: DatePipe,
    private session: SessionService,
    private level: PriorityService,
    private sync: BackgroundSyncService,
    private network: NetworkStatusService,
    private popModal: PopModalService,
    private updateMode: UpdateTaskModeService
  ) {}
  taskList: Task[] = [];
  userId!: number | undefined;
  public destroyRef = inject(DestroyRef);
  public destorySubscription$: Subject<boolean> = new Subject<boolean>();
  ngOnInit(): void {
    /* get the session ID */
    this.getId();

    /* SUBSCRIBE TO THE NETWORK SUBJECT */
    this.getNetworkStatus();

    /* GET ALL TASK */
    this.fetchAllTask();
  }

  /* GET SESSION FOR USER */
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
          this.userId = value?.userId;
        },
      });
  };
  /* END */

  /* FETCH USER TASK */
  public fetchAllTask = () => {
    this.db.taskList$.pipe(takeUntil(this.destorySubscription$)).subscribe({
      next: (value) => {
        /* console.log(JSON.stringify(value, null, 2)); */
        this.taskList = value;
      },
      error: (err) => {
        console.error('Error', err);
      },
    });
  };

  /* END */

  /* ----------- TASK EDIT ----------------- */
  public deleteTask = (taskId: number) => {
    this.db.deleteTask(taskId);
  };

  public type = syncType;

  /* OPEN THE UPDATE MODAL */

  public openUpdateModal = () => {
    // make the modal update mode
    const mode: updateMode = {
      mode: true,
      isOpen: true,
    };

    this.popModal.changeAddTaskModalStatus(mode);
  };

  /* UPDATE THE TASK */
  public updateTasks = () => {};

  public getTaskToday = () => {
    this.filterDB.allTaskByDueDateToday$.subscribe({
      next: (value) => {
        this.taskList = value;
      },
      error: (err) => {
        console.error('Failed to Fetch Task', err);
      },
    });
  };

  /* -------------- END  ----------------- */

  /* get network status*/
  public networkStatus: boolean = false;
  private getNetworkStatus = () => {
    this.network
      .networkStatus$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => (this.networkStatus = value),
        error: (err) => console.error('Error Subscribe network', err),
      });
  };

  /* FILTER WHETHER ON GOING OR FINISH */
  /*  public filterTaskByStatus = () => {
    this.filterDB.allTaskByStatus$.subscribe(
      (value) => (this.taskList = value)
    );
  }; */

  /* FETCH TASK DEPENDING ON PRIORITIES */
  public getByPriorities = () => {
    this.destorySubscription$.next(true);
    this.level.changePriority(2);

    /* this.filterDB.allTaskByPriorities$.subscribe({
      next: (value) => {
        this.taskList = value;
      },
      error: (err) => {
        console.error('Failed to Fetch Task', err);
      },
    }); */
    this.filterDB.getTaskbyPriorityStatus();
  };
}
