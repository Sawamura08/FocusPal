import { Component, OnInit } from '@angular/core';
import { PopModalService } from '../../../../../service/pop-modal.service';
import { TaskObservableService } from '../../../../../service/task-observable.service';
import { TaskComponent } from '../../task.component';
import { ToastrService } from 'ngx-toastr';
import { taskService } from '../../../../../database/task.service';
import { NetworkStatusService } from '../../../../../service/network-status.service';
import { SessionService } from '../../../../../service/session.service';
import { ToastModalService } from '../../../../../service/toast-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { FilterTaskService } from '../../../../../database/filter-task.service';

@Component({
  selector: 'app-task-filter-control',
  templateUrl: './task-filter-control.component.html',
  styleUrl: './task-filter-control.component.scss',
})
export class TaskFilterControlComponent
  extends TaskComponent
  implements OnInit
{
  constructor(
    db: taskService,
    session: SessionService,
    network: NetworkStatusService,
    popModal: PopModalService,
    task$: TaskObservableService,
    toastr: ToastrService,
    toastNotif: ToastModalService,
    filterTask: FilterTaskService
  ) {
    super(
      db,
      session,
      network,
      popModal,
      task$,
      toastr,
      toastNotif,
      filterTask
    );
  }

  override ngOnInit(): void {
    /* GET FILTER choice IF EXIST */
    this.getFilterSelection();
  }

  public filterTextArr: string[] = ['In Progress', 'Completed', 'Past Due'];

  /* MODAL TASK FILTER MODAL */

  public openTaskFilterModal = () => {
    this.popModal.setTaskFilterSignal(true);
    const value = this.popModal.getTaskFilterSignal()();
  };

  public progressFilterIndex: number = 0;
  public setProgressFilter = (index: number) => {
    this.progressFilterIndex = index;

    // SET THE VALUE OF THE PROGRESS INTO INTO FOR FILTER
    this.task$.setTaskProgressFilter(index);

    this.fetchAllTask();
  };

  public getFilterSelection = () => {
    this.task$
      .getUserTaskFilter()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error Fetching Filtered choice', err);
          return of([]);
        })
      )
      .subscribe((filters) => console.log(filters));
  };
}
