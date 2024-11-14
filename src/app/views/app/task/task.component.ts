import { Component, DestroyRef, inject, OnDestroy } from '@angular/core';
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

import {
  ModalType,
  PopModalService,
  updateMode,
} from '../../../service/pop-modal.service';
import { UpdateTaskModeService } from '../../../service/update-task-mode.service';
import { catchError, EMPTY, of, Subject, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskObservableService } from '../../../service/task-observable.service';
import { ToastrService } from 'ngx-toastr';
import { ToastModalService } from '../../../service/toast-modal.service';
import { toastModal } from '../../../interfaces/export.object';
import { unsuccessful } from '../../../Objects/modal.details';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnDestroy {
  constructor(
    private db: taskService,
    private session: SessionService,
    private sync: BackgroundSyncService,
    private network: NetworkStatusService,
    private popModal: PopModalService,
    private updateMode: UpdateTaskModeService,
    private task$: TaskObservableService,
    private toastr: ToastrService,
    private toastNotif: ToastModalService
  ) {}
  taskList: Task[] = [];
  userId!: number | undefined;
  public destroyRef = inject(DestroyRef);
  public destroySubs$: Subject<boolean> = new Subject<boolean>();
  ngOnInit(): void {
    /* get the session ID */
    this.getId();

    /* SUBSCRIBE TO THE NETWORK SUBJECT */
    this.getNetworkStatus();

    /* GET ALL TASK */
    this.setTaskList();

    /* SUBSRIBE TO TOASTR */
    this.getToastr();

    /* FETCH MODAL FOR ACTION(UPDATE OR DELETE) RESULT */
    this.getActionResultModal();
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
    this.db.taskList$.pipe(takeUntil(this.destroySubs$)).subscribe({
      next: (value) => {
        this.task$.setNewTaskList(value);
        this.getFilterDataObservable();
      },
      error: (err) => {
        console.error('Error', err);
      },
    });
  };

  public getFilterDataObservable = () => {
    this.task$
      .getTaskList()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error subscribe on Task List Observable', err);
          return of([]);
        })
      )
      .subscribe({
        next: (value) => {
          this.taskList = value;
        },
      });
  };

  public setTaskList = () => {
    if ((this.taskList = [])) {
      this.fetchAllTask();
    }
  };

  /* END */

  /* ----------- TASK EDIT ----------------- */
  public deleteTask = (taskId: number) => {
    this.db.deleteTask(taskId);
  };

  public type = syncType;

  /* OPEN THE UPDATE MODAL */

  public taskData: Task | undefined = undefined;
  public openUpdateModal = (data: Task) => {
    // make the modal update mode
    const mode: updateMode = {
      mode: true,
      isOpen: true,
    };

    this.popModal.changeAddTaskModalStatus(mode);

    /* SET TASK DATA */
    this.taskData = data;
    this.task$.setTaskDataValue(this.taskData);
  };

  /* -------------- END  ----------------- */

  /* SUBSRIBE TO TOASTER MODAL AND CONFIGURE */

  public getToastr = () => {
    this.toastNotif
      .getToastModal()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => this.triggerToast(value),
        error: (err) => console.error('Error Subscribe on Toastr', err),
      });
  };

  private triggerToast = (value: toastModal) => {
    /* RESET NOTIF */
    const toastModalReset: toastModal = {
      type: '',
      status: false,
    };
    if (value.type === 'Update' && value.status) {
      this.toastr.success(
        'Update Successful',
        'The schedule has been updated successfully.',
        { timeOut: 2500 }
      );

      // I INCLUDE THIS TO PREVENT MAX STACK SIZE ERROR
      this.toastNotif.switchToastModal(toastModalReset);
    } else if (value.type === 'Delete' && value.status) {
      this.toastr.success(
        'Deletion Successful',
        'The schedule has been deleted successfully.',
        { timeOut: 2500 }
      );

      // I INCLUDE THIS TO PREVENT MAX STACK SIZE ERROR
      this.toastNotif.switchToastModal(toastModalReset);
    }
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

  /* ERROR RESULT ON UPDATE OR DELETE */
  public isResultModalOpen: ModalType = ModalType.NONE;
  public resultModalDetail = unsuccessful;
  public getActionResultModal = () => {
    this.popModal
      .getModalStatus()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error On Modal Subsribe ', err);
          return EMPTY;
        })
      )
      .subscribe((result) => {
        this.isResultModalOpen = result;
        console.log(result);
      });
  };

  /* MODAL TASK FILTER MODAL */

  public openTaskFilterModal = () => {
    this.popModal.setTaskFilterSignal(true);
    const value = this.popModal.getTaskFilterSignal()();
  };

  ngOnDestroy(): void {
    this.destroySubs$.next(true);
  }
}
