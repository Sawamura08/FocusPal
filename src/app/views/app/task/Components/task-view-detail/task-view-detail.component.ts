import { Component, Input, OnInit } from '@angular/core';
import { SubTasks, Task } from '../../../../../database/db';
import { SubTaskService } from '../../../../../database/sub-task.service';
import {
  PopModalService,
  updateMode,
} from '../../../../../service/pop-modal.service';
import { taskCompletion } from '../../../../../interfaces/export.object';
import { slideRight } from '../../../../../animation/slide-right.animate';
import { TaskObservableService } from '../../../../../service/task-observable.service';

@Component({
  selector: 'app-task-view-detail',
  templateUrl: './task-view-detail.component.html',
  styleUrl: './task-view-detail.component.scss',
  animations: [slideRight],
})
export class TaskViewDetailComponent implements OnInit {
  constructor(
    protected SubTask: SubTaskService,
    protected popModal: PopModalService,
    protected task$: TaskObservableService
  ) {}

  ngOnInit(): void {
    /* FETCH SUBTASK FOR THIS TASK */
    this.fetchSubTask(this.details.taskId!);
  }

  @Input() details!: Task;
  public animateModal: boolean = true;

  /* CLOSE TASK DETAIL VIEW MODAL */
  public closeTaskDetailModal = () => {
    this.animateModal = false;

    setTimeout(() => {
      this.popModal.setTaskViewSignal(false);
    }, 400);
  };

  /* TOGGLE THE EDIT SETTINGS */
  public isEditTaskOpen: boolean = false;
  public toggleEditTask = () => {
    this.isEditTaskOpen = !this.isEditTaskOpen;
  };

  /* update the subtasks status */
  /*  public completeSubTasks: number[] = []; */
  public changeSubTaskStatus = (subTaskIndex: number) => {
    /* CHECK FIRST  */
    const result = this.syncDataToUI(subTaskIndex);

    if (!result) {
      this.subTasks![subTaskIndex].status = taskCompletion.COMPLETE;
    } else {
      this.subTasks![subTaskIndex].status = taskCompletion.PENDING;
    }

    this.SubTask.updateSubTaskStatus(this.subTasks![subTaskIndex]);
  };

  /* THIS FUNCTION HAS DUAL PURPOSE SYNC DATA AND CHECK IF IT'S COMPLETED */
  /* CHANGE THE UI COMPLETE DEPENDING ON STATUS */
  public syncDataToUI = (index: number) => {
    return this.subTasks![index].status === 1;
  };

  /* FETCH SUBTASKS DATA */
  public subTasks: SubTasks[] | undefined;
  public fetchSubTask = async (taskId: number) => {
    this.subTasks = await this.SubTask.getSubTaskData(taskId);
  };

  /* OPEN THE UPDATE MODAL */

  public taskData: Task | undefined = undefined;
  public openUpdateModal = (data: Task) => {
    // make the modal update mode
    const mode: updateMode = {
      mode: true,
      isOpen: true,
    };

    /* CLOSE THE VIEW TASK DETAIL MODAL */
    this.animateModal = false;
    setTimeout(() => {
      this.popModal.setTaskViewSignal(false);
    }, 400);

    /* OPEN UPDATE TASK MODAL */
    this.popModal.changeAddTaskModalStatus(mode);

    /* SET TASK DATA */
    this.taskData = data;
    this.task$.setTaskDataValue(this.taskData);
  };
}
