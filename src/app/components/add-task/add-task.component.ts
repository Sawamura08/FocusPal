import { Component, OnInit } from '@angular/core';
import { PopModalService } from '../../service/pop-modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit {
  constructor(private popModal: PopModalService) {}
  ngOnInit(): void {
    /* SUBSCRIBE ADDTASK MODAL */
    this.addTaskSubscribe();
  }

  /* SUBSCRIBE ADDTASK MODAL */
  public modalStatus: boolean | null = null;
  private addTaskSubscription!: Subscription;
  private addTaskSubscribe = () => {
    this.addTaskSubscription = this.popModal.getAddTaskModalStatus().subscribe({
      next: (value) => (this.modalStatus = value),
      error: (err) => console.error('Error Subscribe Add Task', err),
    });
  };

  /* SETTING UP BUTTON ON-CLICKS ON FORMS */
  categoryIndex: number | null = null;
  public selectCategory = (index: number) => {
    this.categoryIndex = index;
  };

  priorityIndex: number | null = null;
  public selectPriority = (index: number) => {
    this.priorityIndex = index;
  };
  /* END */

  /* ADD OR UPDATE SUBTASK */

  subTaksInput: string = '';
  isSubTaskMode: boolean = false;
  subTaskList: string[] = [
    '        Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
    'pulsing',
    'row',
  ];
  public subTasks = () => {
    if (this.isSubTaskMode && this.subTaksInput != '') {
      this.setSubTasks(this.subTaksInput);
    } else {
      this.isSubTaskMode = !this.isSubTaskMode;
    }
  };

  public setSubTasks = (value: string) => {
    this.subTaskList?.push(value);
    console.log(JSON.stringify(this.subTaskList));
    this.subTaksInput = '';
  };

  public deleteSubTask = (index: number) => {
    this.subTaskList.splice(index, 1);
  };

  /* END */

  /* CLOSE ADD TASK */

  public closeAddTask = () => {
    this.popModal.changeAddTaskModalStatus(false);
  };
}
