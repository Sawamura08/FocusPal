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
  taskCompletion,
  toastModal,
} from '../../interfaces/export.object';
import { TaskObservableService } from '../../service/task-observable.service';
import { subTaskTypes, taskFilter } from '../../interfaces/Request';
import { SubTasks, Task } from '../../database/db';
import { ToastModalService } from '../../service/toast-modal.service';
import { modalStatus, unsuccessful } from '../../Objects/modal.details';
import { DateTimeService } from '../../service/date-time.service';
import { SubTaskService } from '../../database/sub-task.service';
import { GameUserDataService } from '../../database/game-user-data.service';
import { GamifiedCompletionService } from '../gamified-completion-modal/service/gamified-completion.service';
import { noWhitespaceValidator } from '../../views/auth/signup/match-pass-validator';
import { DatePipe } from '@angular/common';

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
    private dateTime: DateTimeService,
    protected subTaskService: SubTaskService,
    protected gamified: GameUserDataService,
    protected gameData: GamifiedCompletionService,
    protected datePipe: DatePipe
  ) {
    this.userInput = this.fb.group({
      title: ['', [Validators.required, noWhitespaceValidator()]],
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

        //CHECK IF THE VALUE IS UPDATE MODE
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
  public setTaskCompletion = async () => {
    if (!this.isTaskComplete) {
      this.taskData.status = taskCompletion.COMPLETE;
      //this.taskData.completeAnimationStatus = true;
      this.isTaskComplete = true;
    } else {
      this.taskData.status = taskCompletion.PENDING;
      this.isTaskComplete = false;
    }

    // update the task status
    const result = await this.task.setTaskCompletetionStatus(this.taskData);

    if (
      result.value &&
      result.updateKeyValue === taskCompletion.COMPLETE &&
      !this.taskData.completeAnimationStatus
    ) {
      this.setTaskCompletionData();
    } else {
      this.closeTaskModal();
    }
  };

  // SET COMPLETION USER DATA FOR MODAL
  public setTaskCompletionData = async () => {
    const result = await this.gamified.fetchUserByID(this.userId!);

    /* SET VALUE ON MODAL */
    if (result && result.value != undefined) {
      this.setTaskCompletionAnimationOnce();
      this.gameData.setCompletionModalValue(result.value);

      this.closeTaskModal();
      this.gameData.setCompletionModalStatus(modalStatus.open);
    } else {
      console.log(result);
    }
  };
  /* END */

  /* PREVENT TASK COMPLETION ANIMATION/ LIMIT TO ONE*/
  public setTaskCompletionAnimationOnce = async () => {
    if (this.taskData) {
      this.taskData.completeAnimationStatus = true;
      const result = await this.task.setTaskCompletetionStatus(this.taskData);
    }
  };

  /* RESTRICT PAST DATES ON DATE SELECTOR */
  public startDaterestrictDates = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //CHECKER FOR THE START DATE AND DUE DATE
    // Ensuring dueDate >= startDate;
    const dueDate = this.userInput.get('dueDate')?.value;
    const dueDateTime = dueDate ? new Date(dueDate).setHours(0, 0, 0, 0) : null;
    return (
      (date || today) >= today &&
      (!dueDateTime || (date ? date.getTime() : today.getTime()) <= dueDateTime)
    ); // Only allow today and future dates
  };

  public dueDaterestrictDates = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //CHECKER FOR THE START DATE AND DUE DATE
    // Ensuring dueDate >= startDate;
    const startDate = this.userInput.get('startDate')?.value;
    const startDateTime = startDate
      ? new Date(startDate).setHours(0, 0, 0, 0)
      : null;
    return (
      (date || today) >= today &&
      (!startDateTime ||
        (date ? date.getTime() : today.getTime()) >= startDateTime)
    ); // Only allow today and future dates
  };

  /* CHECK DUETIME IF IT'S PAST THE CURRENT TIME (FOR TODAY DUE DATES ONLY) */
  public modalType = ModalType;
  public dueDateTimeValidityStatus: ModalType = ModalType.NONE;
  public checkDueTime = () => {
    const dueDate = this.userInput.get('dueDate')?.value;
    const dueTime = this.userInput.get('dueTime')?.value;
    const today = new Date();
    const currentTime = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMilliseconds = today.getTime();

    // check if the user select today as due date
    if (dueDate.getTime() === todayMilliseconds) {
      if (dueTime.getTime() > currentTime.getTime()) {
        return 'VALID';
      } else {
        return 'INVALID';
      }
    } else {
      return 'VALID';
    }
  };

  /* ADD OR UPDATE SUBTASK */

  public subTaksInput: string = '';
  public isSubTaskOpen: boolean = false;
  protected closing: boolean = false;
  public subTaskList: subTaskTypes[] = [];

  // unique identifier
  public subTaskId: number | undefined;

  /* SUBTASK LIST TO BE UPDATED  on subtask object */
  public subTaskListForUpdate: subTaskTypes[] = [];

  /* SUBTASK LIST TO BE DELETED on subtask object */
  public subTaskListForDelete: subTaskTypes[] = [];

  /* SUBTASK LIST TO BE INSERTED on subtask object */
  public subTaskListForInsert: subTaskTypes[] = [];

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
      //CREATE UNIQUE ID FOR SUBTASK
      this.subTaskId = this.subTaskUniqueID();
      const newSubTask: subTaskTypes = {
        id: this.subTaskId!,
        data: this.subTaksInput,
      };
      //SET THE SUBTASK DATA
      this.setSubTasks(newSubTask);
      this.subTaskListForInsert.push(newSubTask);
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

  /* ON BLUR CHANGE THE BUTTON TEXT */
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

  public deleteSubTask = (index: number, subTask: subTaskTypes) => {
    // deletion from the UI and userinput
    this.subTaskList.splice(index, 1);
    this.addTaskConfig.setValueOnChange(this.subTaskList, 'subTasks');

    //deletion from the subtask object
    this.subTaskListForDelete.push(subTask);
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
    const subTaskList = [...subtaskList];
    let subTask = subTaskList[index];
    subTask.data = newInput;

    //update
    this.subTaskListForUpdate.push(subTask);
    this.addTaskConfig.setValueOnChange(this.subTaskList, 'subTasks');
  };
  /* END */

  /* CREATE UNIQUE IDENTIFIER FOR THE SUBTASK in TASK */
  public subTaskUniqueID = () => {
    return new Date().getTime();
  };

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
    const isDueDateTimeValid = this.checkDueTime();

    if (isDueDateTimeValid === 'INVALID') {
      this.dueDateTimeValidityStatus = ModalType.INCORRECT;
    }

    if (this.userInput.valid && isDueDateTimeValid === 'VALID') {
      this.dueDateTimeValidityStatus = ModalType.NONE;
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
  public syncDataToUI = async (data: Task) => {
    // SET UI
    this.categoryIndex = data.taskCategory;
    this.tagIndex = data.tags;
    this.priorityIndex = data.priority;
    this.taskId = data.taskId;
    this.isTaskComplete =
      data.status === taskCompletion.COMPLETE ? true : false;
    // SET WHICH TAG TO DISPLAY
    this.tagList = this.setTagListValue();

    this.dueTime = this.dateTime.transformDateToTime(data.dueTime);

    if (data.subTasks?.length != undefined) {
      //DEEP COPY since if I modify the (subTaksList = data.Subtasks) it will modify the object directly (data.subTasks)
      this.subTaskList = structuredClone(data.subTasks);
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
          // UPDATE OR DELETE THE SUBTASK OBJECT
          this.insertSubTaskObject(this.subTaskListForInsert, this.taskId!);
          this.updateSubTaskObject(this.subTaskListForUpdate);
          this.deleteSubTaskObject(this.subTaskListForDelete);
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
        this.subTaskService.deleteAllSubTaskByTaskId(this.taskId!);
        this.toastNotif.switchToastModal(toastConfig);
      } finally {
        this.closeTaskModal();
      }
    }
  };

  /* UPDATE SUBTASK OBJECT ON INDEXEDB */

  public updateSubTaskObject = (subTaskForEdit: subTaskTypes[]) => {
    if (subTaskForEdit.length > 0) {
      subTaskForEdit.forEach(async (subTask) => {
        let subTaskObject = await this.fetchSubTaskById(subTask.id);
        if (subTaskObject != null) {
          subTaskObject.subTask = subTask.data;

          const result = await this.subTaskService.updateSubTaskStatus(
            subTaskObject
          );
        }
      });
    }
  };

  /* DELETE SUBTASK OBJECT ON INDEXEDB */

  public deleteSubTaskObject = (subTaskList: subTaskTypes[]) => {
    if (subTaskList.length > 0) {
      subTaskList.forEach(async (subTask) => {
        const subTaskObject = await this.fetchSubTaskById(subTask.id);

        if (subTaskObject != null && subTaskObject.subTaskId != null) {
          console.log('deleted');
          this.subTaskService.deleteSubTaskById(subTaskObject.subTaskId);
        }
      });
    }
  };

  /* INSERT SUBTASK OJECT ON INDEXEDB */

  public insertSubTaskObject = (
    subTaskAddList: subTaskTypes[],
    taskId: number
  ) => {
    if (this.subTaskList.length > 0) {
      subTaskAddList.forEach(async (subTask) => {
        const result = await this.subTaskService.insertSubTaskOnUpdate(
          subTask,
          taskId
        );
      });
    }
  };

  /* FETCH SBUTASK FOR UPDATE OR DELETE */
  public fetchSubTaskById = async (
    id: number
  ): Promise<SubTasks | undefined> => {
    return await this.subTaskService.getSubTaskById(id);
  };

  /* HANDLES OBSERBABLES CONFIRMATION MODAL */
  public modalModeObservable = () => {
    const confirmModal = this.popModal.getConfirmModalStatus();
    const errorModal = this.popModal.getModalStatus();

    combineLatest([confirmModal, errorModal])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error On Subscribing on Modals', err);
          return EMPTY;
        })
      )
      .subscribe({
        next: ([isConfirmModalOpen, isErrorModalOpen]) => {
          this.isConfirmModalOpen = isConfirmModalOpen;
          this.dueDateTimeValidityStatus = isErrorModalOpen;
        },
      });
  };

  public popUpModalErrorData: any = {
    title:
      'The selected due time has already passed. Please pick a time in the future.',
    imgPath: '/extra/remove.png',
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
  public openSubTaskConfirmationModal = async (
    index: number,
    subTask: subTaskTypes
  ) => {
    this.popModal.setConfirmaModalStatus(true);

    const response = await this.getUserConfirmResponse();

    if (response && index != undefined) {
      this.popModal.setConfirmaModalStatus(false);
      this.deleteSubTask(index, subTask);
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
