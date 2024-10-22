import { Component } from '@angular/core';
import { DatabaseService } from '../../../database/database.service';
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

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  constructor(
    private db: DatabaseService,
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
  userId!: number;
  ngOnInit(): void {
    /* get the session ID */
    this.getId();

    /* SUBSCRIBE TO THE NETWORK SUBJECT */
    this.getNetworkStatus();
    this.db.getTastList().subscribe({
      next: (value) => {
        console.log(JSON.stringify(value, null, 2));
        this.taskList = value;
      },
      error: (err) => {
        console.error('Error', err);
      },
    });
  }
  /* GET SESSION FOR USER */
  public getId = async () => {
    const id = await this.session.getUser();

    this.userId = id;
  };
  /* END */

  /* get network status*/
  public networkStatus: boolean = false;
  private getNetworkStatus = () => {
    this.network.networkStatus$().subscribe({
      next: (value) => (this.networkStatus = value),
      error: (err) => console.error('Error Subscribe network', err),
    });
  };

  public filterTaskByStatus = () => {
    this.filterDB.allTaskByStatus$.subscribe(
      (value) => (this.taskList = value)
    );
  };

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

  /* FETCH TASK DEPENDING ON PRIORITIES */
  public getByPriorities = () => {
    this.level.changePriority(3);
    this.filterDB.allTaskByPriorities$.subscribe({
      next: (value) => {
        this.taskList = value;
      },
      error: (err) => {
        console.error('Failed to Fetch Task', err);
      },
    });
  };
}
