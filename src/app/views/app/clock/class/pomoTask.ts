import { DestroyRef, inject } from '@angular/core';
import { PomodoroTaskService } from '../../../../database/pomodoro-task.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { ResponseService } from '../../../../service/reponse.service';
import { SessionService } from '../../../../service/session.service';
import { pomoTask } from '../../../../interfaces/pomoPal';
import { ToastrService } from 'ngx-toastr';
import { ToastModalService } from '../../../../service/toast-modal.service';
import { toastModal } from '../../../../interfaces/export.object';

export class PomoTask {
  constructor(
    protected pomoTask: PomodoroTaskService,
    protected response: ResponseService,
    protected session: SessionService,
    protected toastr: ToastrService,
    protected toastNotif: ToastModalService
  ) {
    this.toasterObservable();
  }

  public destoryRef = inject(DestroyRef);

  public fetchSessionID = (): Observable<undefined | number> => {
    return this.session.getUser().pipe(
      map((value) => value?.userId),
      catchError((err) => {
        const error = this.response.errorResponse();
        console.error(error, err);
        return of(undefined);
      }),
      takeUntilDestroyed(this.destoryRef)
    );
  };

  /* CRUD */
  public insertNewTask = async (task: pomoTask) => {
    const result = await this.pomoTask.insertTask(task);

    if (result.value != undefined && result.success) {
      this.toastConfig('Insert', true);
    } else {
      this.toastConfig('Insert', false);
    }
  };

  public updateTask = async (key: number, task: pomoTask) => {
    const result = await this.pomoTask.updateTask(key, task);

    if (result.value != undefined && result.success) {
      this.toastConfig('Update', true);
    } else {
      this.toastConfig('Update', false);
    }
  };

  public deleteTask = async (key: number) => {
    await this.pomoTask.deleteTask(key);

    this.toastConfig('Delete', true);
  };
  /* END OF CRUD */

  public toastConfig = (type: string, actionStatus: boolean) => {
    this.toastNotif.switchToastModal({
      type: type,
      status: true,
      actionStatus: actionStatus, // if the task is successful
    });
  };

  /* TOASTER NOTIF */

  public triggerToaster = (value: toastModal) => {
    const resetToaster: toastModal = {
      type: '',
      status: false,
    };
    if (value.type != '' && value.status && value.actionStatus) {
      this.toastr.success(
        `${value.type} Successful`,
        `The task has been ${value.type.toLocaleLowerCase()} successfully.`,
        { timeOut: 2500 }
      );

      this.toastNotif.switchToastModal(resetToaster);
    } else if (value.type != '' && value.status && !value.actionStatus) {
      this.toastr.error(`${value.type} Unsuccessful`, `Please Try Again`, {
        timeOut: 2500,
      });

      this.toastNotif.switchToastModal(resetToaster);
    }
  };

  public toasterObservable = () => {
    this.toastNotif
      .getToastModal()
      .pipe(
        takeUntilDestroyed(this.destoryRef),
        catchError((err) => {
          const error = this.response.errorResponse();
          console.error(error, err);
          return EMPTY;
        })
      )
      .subscribe((value) => this.triggerToaster(value));
  };
}
