import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopModalService } from '../../service/pop-modal.service';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AddTaskInput } from '../../class/add-task-input';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit, OnDestroy {
  subscriptionArr: Subscription[] = [];
  constructor(private popModal: PopModalService, private fb: FormBuilder) {
    this.userInput = this.fb.group({
      userId: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      subTask: [''],
      priority: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      createdAt: ['', Validators.required],
      taskCategory: ['', Validators.required],
    });

    this.addTaskConfig = new AddTaskInput(this.userInput);
  }
  ngOnInit(): void {
    /* SUBSCRIBE ADDTASK MODAL */
    this.addTaskSubscribe();
  }

  /* REACTIVE FORMS */
  private addTaskConfig: AddTaskInput;
  public userInput: FormGroup;

  /* VALIDATORS */

  public validator = (fieldName: string): boolean => {
    return this.addTaskConfig.errorChecker(fieldName);
  };

  /* GETTERS */

  get title() {
    return this.userInput.get('title');
  }

  /* END */

  /* SUBSCRIBE ADDTASK MODAL */
  public modalStatus: boolean | null = null;
  private addTaskSubscription!: Subscription;
  private addTaskSubscribe = () => {
    this.addTaskSubscription = this.popModal.getAddTaskModalStatus().subscribe({
      next: (value) => (this.modalStatus = value),
      error: (err) => console.error('Error Subscribe Add Task', err),
    });

    this.subscriptionArr.push(this.addTaskSubscription);
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
    'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
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
  /* NED */

  /* SUBMIT FORMS */

  public submit = () => {
    this.addTaskConfig.setCategoryValue(
      this.categoryIndex!,
      this.priorityIndex!,
      this.subTaskList
    );

    console.log(this.userInput.value);
  };

  /* NG ON DESTORY */
  ngOnDestroy(): void {
    if (this.subscriptionArr)
      this.subscriptionArr.forEach((subs) => subs.unsubscribe());
  }
}
