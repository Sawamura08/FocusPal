import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  ModalType,
  PopModalService,
  updateMode,
} from '../../service/pop-modal.service';
import {
  catchError,
  combineLatest,
  EMPTY,
  firstValueFrom,
  interval,
  of,
  Subscription,
} from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AddTaskInput } from '../../class/add-task-input';
import { SessionService } from '../../service/session.service';
import { taskService } from '../../database/task.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UpdateTaskModeService } from '../../service/update-task-mode.service';
import { slideRight } from '../../animation/slide-right.animate';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  categories,
  confirm,
  SubtTaskModes,
  toastModal,
} from '../../interfaces/export.object';
import { TaskObservableService } from '../../service/task-observable.service';
import { subTaskTypes, taskFilter } from '../../interfaces/Request';
import { Task } from '../../database/db';
import { ToastModalService } from '../../service/toast-modal.service';
import { unsuccessful } from '../../Objects/modal.details';
import { DateTimeService } from '../../service/date-time.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  animations: [slideRight],
})
export class AddTaskComponent implements OnInit, OnDestroy {
  subscriptionArr: Subscription[] = [];
  private destroyRef = inject(DestroyRef);
  constructor(
    private popModal: PopModalService,
    private fb: FormBuilder,
    private session: SessionService,
    private task: taskService,
    private route: Router,
    private actRoute: ActivatedRoute,
    private updateMode: UpdateTaskModeService,
    private task$: TaskObservableService,
    private toastNotif: ToastModalService,
    private dateTime: DateTimeService
  ) {
    this.userInput = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subTasks: [''],
      priority: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      dueTime: ['', Validators.required],
      taskCategory: ['', Validators.required],
      tags: ['', Validators.required],
    });

    this.addTaskConfig = new AddTaskInput(this.userInput);
    this.tagList = this.addTaskConfig.taskTagsPersonal;
  }
  ngOnInit(): void {
    /* SUBSCRIBE ADDTASK MODAL */
    this.modalTaskSubsribe();

    /* FETCH SESSION */
    this.getSession();

    /* FETCH MODAL MODE INSERT OR UPDATE */
    this.modalModeObservable();
  }

  /* GET SESSION */
  private userId: number | undefined = undefined;
  private getSession = async () => {
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

  /* REACTIVE FORMS */
  protected addTaskConfig: AddTaskInput;
  public userInput: FormGroup;

  /* VALIDATORS */

  public validator = (fieldName: string): boolean => {
    return this.addTaskConfig.errorChecker(fieldName);
  };

  /* GETTERS */

  get title() {
    return this.userInput.get('title');
  }

  get taskCategory() {
    return this.userInput.get('taskCategory');
  }

  get priority() {
    return this.userInput.get('priority');
  }

  get startDate() {
    return this.userInput.get('startDate');
  }

  get dueDate() {
    return this.userInput.get('dueDate');
  }

  get tags() {
    return this.userInput.get('tags');
  }

  /* END */

  /* SUBSCRIBE TASK MODAL */
  public modalStatus: updateMode | null = null;
  protected animateModal: boolean = true;
  private addTaskSubscription!: Subscription;
  private modalTaskSubsribe = () => {
    this.addTaskSubscription = this.popModal.getAddTaskModalStatus().subscribe({
      next: (value) => {
        this.modalStatus = value;

        if (this.modalStatus.mode) {
          this.fetchTaskData();
        }
      },
      error: (err) => console.error('Error Subscribe Add Task', err),
    });

    this.subscriptionArr.push(this.addTaskSubscription);
  };

  /* SETTING UP BUTTON ON-CLICKS ON FORMS */
  categoryIndex: number | null = null;
  public personalCategory: number = categories.PERSONAL;
  public selectCategory = (index: number) => {
    this.categoryIndex = index;

    // this will set the value for the form TaskCategory
    if (this.categoryIndex != null) {
      this.tagList = this.setTagListValue();

      this.addTaskConfig.setValueOnChange(this.categoryIndex, 'taskCategory');
    }
  };

  /* SET THE TAG LIST TO DISPLAY */

  public setTagListValue = (): string[] => {
    return this.categoryIndex === this.personalCategory
      ? this.addTaskConfig.taskTagsPersonal
      : this.addTaskConfig.taskTagsAcademic;
  };

  priorityIndex: number | null = null;
  public selectPriority = (index: number) => {
    this.priorityIndex = index;

    // this will set the value for the form TaskPriority
    if (this.priority != null) {
      this.addTaskConfig.setValueOnChange(this.priorityIndex, 'priority');
    }
  };

  public tagIndex: number | null = null;
  public tagList: string[] = [];
  public selectTags = (index: number) => {
    this.tagIndex = index;
    // this will set the value for the form taskTags
    if (this.tags != null) {
      this.addTaskConfig.setValueOnChange(this.tagIndex, 'tags');
    }
  };

  // COMPLETE THE TASK
  public isTaskComplete: boolean = false;
  public setTaskCompletion = () => {
    this.isTaskComplete = !this.isTaskComplete;
  };
  /* END */

  /* ADD OR UPDATE SUBTASK */

  public subTaksInput: string = '';
  public isSubTaskOpen: boolean = false;
  protected closing: boolean = false;
  public subTaskList: subTaskTypes[] = [];

  // unique identifier
  public subTaskId: number = 0;

  // just interface
  protected subTasksMode = SubtTaskModes;

  // which mode is used on subtasks
  public modeUsed: SubtTaskModes = this.subTasksMode.AddMode;

  // use to determine which subtask to edit
  public editSubtaskById: number | undefined;

  public subTasks = (mode: number, subTaskId?: number) => {
    if (
      mode === this.subTasksMode.AddMode &&
      this.isSubTaskOpen &&
      this.subTaksInput != ''
    ) {
      const newSubTask: subTaskTypes = {
        id: this.subTaskId,
        data: this.subTaksInput,
      };
      this.setSubTasks(newSubTask);
      this.subTaskId++;
      this.subTaskButtonText = 'Add';
    } else if (
      mode === this.subTasksMode.UpdateMode &&
      this.isSubTaskOpen &&
      this.subTaksInput != ''
    ) {
      this.subTaskButtonText = 'Update';
      if (
        subTaskId != undefined &&
        this.subTaskList[subTaskId].data != this.subTaksInput
      ) {
        this.updateSubTask(subTaskId, this.subTaskList, this.subTaksInput);
      }
    } else {
      console.log('close');
      this.isSubTaskOpen ? this.closeSubTask() : (this.isSubTaskOpen = true);
    }
  };

  public closeSubTask = () => {
    this.closing = true;

    setTimeout(() => {
      this.isSubTaskOpen = false;
      this.closing = false;
    }, 450);
  };

  protected subTaskButtonText: string = 'Add';
  public changeSubTaskText = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.subTaskButtonText = inputElement.value != '' ? 'Save' : 'Add';
  };

  public setSubTasks = (value: subTaskTypes) => {
    this.subTaskList?.push(value);
    this.addTaskConfig.setValueOnChange(this.subTaskList, 'subTasks');
    this.subTaksInput = '';
  };

  public deleteSubTask = (index: number) => {
    this.subTaskList.splice(index, 1);
  };

  /* SET UP SUBTASK FOR UPDATE */
  public setUpdateSubTaskMode = (index: number) => {
    /* SET THE SUBTASK INPUT INTO UPDATE MODE  */
    if (!this.isSubTaskOpen) {
      this.setSubTaskInputConfig(index);
      this.subTasks(this.subTasksMode.UpdateMode, index);
    } else {
      this.subTaskButtonText = 'Add';
      this.closeSubTask();
    }
  };

  public setSubTaskInputConfig = (index: number) => {
    this.isSubTaskOpen = true;
    this.subTaksInput = this.subTaskList[index].data;
    this.modeUsed = this.subTasksMode.UpdateMode;
    this.editSubtaskById = index;
  };

  public updateSubTask = (
    index: number,
    subtaskList: subTaskTypes[],
    newInput: string
  ) => {
    let subTask = subtaskList[index];
    subTask.data = newInput;

    //update
    //this.addTaskConfig.setValueOnChange(this.subTaskList, 'subTasks');
    console.log(JSON.stringify(this.userInput.value, null, 2));
    console.log(this.task$.getTaskDataSignal()());
  };
  /* END */

  /* END OF SUBTASK */

  /* for TIME DEADLINE */
  public dueTime: string = '';
  public invalidDueTime: boolean = false;
  public setDueTime = (timeValue: string) => {
    // check whether the 'dueTime' has a value
    if (timeValue != '') {
      this.invalidDueTime = false;
      let newFormat: Date = this.dateTime.transformTimeToDate(timeValue);
      this.userInput.get('dueTime')?.setValue(newFormat);
      return;
    } else {
      this.invalidDueTime = true;
      return;
    }
  };

  /* END */

  /* CLOSE ADD TASK */

  public closeTaskModal = () => {
    this.animateModal = false;

    setTimeout(() => {
      /* SET MODE */
      const mode: updateMode = {
        mode: false,
        isOpen: false,
      };
      /* CLOSE MODAL */
      this.popModal.changeAddTaskModalStatus(mode);
    }, 500);
  };
  /* END */

  /* SUBMIT FORMS */

  public submit = async () => {
    this.addTaskConfig.setCategoryValue(this.subTaskList);

    this.userInput.markAllAsTouched();

    if (this.userInput.valid) {
      //RESET SUBTASK ID FOR NEW TASK
      this.subTaskId = 0;

      /* INSERT */
      const taskId = await this.task.insertTask(
        this.userId!,
        this.userInput.value
      );

      if (taskId) {
        this.closeTaskModal();
        this.route.navigate(['task'], { relativeTo: this.actRoute });
      }
    }
  };

  /* ------------------- UPDATE MODE ---------------------------- */

  //
  //
  //
  //
  //
  //
  //

  /* SET THE DATA */
  public taskData: any;
  public fetchTaskData = () => {
    this.taskData = this.task$.getTaskDataSignal()();

    this.syncDataToUI(this.taskData);
    // SET THE DATA TO REACTIVE FORMS
    this.userInput.patchValue(this.taskData);
  };

  /* SET TASK DATA IN THE UI UDPATE | DELETE */
  public syncDataToUI = (data: Task) => {
    // SET UI
    this.categoryIndex = data.taskCategory;
    this.tagIndex = data.tags;
    this.priorityIndex = data.priority;
    this.taskId = data.taskId;
    // SET WHICH TAG TO DISPLAY
    this.tagList = this.setTagListValue();

    this.dueTime = this.dateTime.transformDateToTime(data.dueTime);

    if (data.subTasks) {
      this.subTaskList = data.subTasks;
    }
  };

  /* UPDATE SPECIFIC TASK */

  public taskId: number | undefined = undefined;
  public updateTask = async () => {
    const toastConfig: toastModal = { type: 'Update', status: true };
    const response = await this.openConfirmationModal();
    if (response) {
      try {
        const result = await this.task.updateTask(
          this.userInput.value,
          this.taskId!
        );

        if (result) {
          this.toastNotif.switchToastModal(toastConfig);
        } else {
          this.popModal.openModal(ModalType.UNSUCCESSFUL);
        }
      } finally {
        this.closeTaskModal();
      }
    }
  };

  /* DELETE SPECIFIC TASK */
  public deleteTask = async () => {
    const toastConfig: toastModal = { type: 'Delete', status: true };

    const response = await this.openConfirmationModal();

    if (response) {
      try {
        this.task.deleteTask(this.taskId!);

        this.toastNotif.switchToastModal(toastConfig);
      } finally {
        this.closeTaskModal();
      }
    }
  };

  /* HANDLES OBSERBABLES CONFIRMATION MODAL */
  public modalModeObservable = () => {
    const confirmModal = this.popModal.getConfirmModalStatus();

    combineLatest([confirmModal])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error On Subscribing on Modals', err);
          return EMPTY;
        })
      )
      .subscribe({
        next: ([isConfirmModalOpen]) => {
          this.isConfirmModalOpen = isConfirmModalOpen;
        },
      });
  };

  /* CONFIRMATION MODAL FOR TASK*/

  public isConfirmModalOpen: boolean | null = null;
  public confirm = confirm;
  /* OPEN THE MODAL AND RECIEVE THE USER RESPONSE */
  public openConfirmationModal = async () => {
    this.popModal.setConfirmaModalStatus(true);

    try {
      const response = await this.getUserConfirmResponse();
      return response;
    } finally {
      this.popModal.setConfirmaModalStatus(false);
    }
  };

  /* CONFIRMATION MODAL FOR SUBTASK */
  public openSubTaskConfirmationModal = async (subTaskIndex: number) => {
    this.popModal.setConfirmaModalStatus(true);

    const response = await this.getUserConfirmResponse();

    if (response && subTaskIndex) {
      this.popModal.setConfirmaModalStatus(false);
      this.deleteSubTask(subTaskIndex);
    }
  };

  public getUserConfirmResponse = async (): Promise<boolean> => {
    return firstValueFrom(
      this.popModal.getConfirmationModal().pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error on Getting Reponse', err);
          return of(false);
        })
      )
    );
  };

  /* END */

  /* NG ON DESTORY */
  ngOnDestroy(): void {
    if (this.subscriptionArr)
      this.subscriptionArr.forEach((subs) => subs.unsubscribe());

    /* console.log('Component destroyed'); */
  }
}
