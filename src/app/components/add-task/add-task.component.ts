import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  inject,
  DestroyRef,
} from '@angular/core';
import { PopModalService, updateMode } from '../../service/pop-modal.service';
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
import { categories, confirm } from '../../interfaces/export.object';

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
    private updateMode: UpdateTaskModeService
  ) {
    this.userInput = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subTask: [''],
      priority: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
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
      next: (value) => (this.modalStatus = value),
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
      this.tagList =
        this.categoryIndex === this.personalCategory
          ? this.addTaskConfig.taskTagsPersonal
          : this.addTaskConfig.taskTagsAcademic;
      this.addTaskConfig.setValueOnChange(this.categoryIndex, 'taskCategory');
    }
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

  subTaksInput: string = '';
  isSubTaskMode: boolean = false;
  protected closing: boolean = false;
  subTaskList: string[] = [];
  public subTasks = () => {
    if (this.isSubTaskMode && this.subTaksInput != '') {
      this.setSubTasks(this.subTaksInput);
      this.subTaskButtonText = 'Add';
    } else {
      this.isSubTaskMode ? this.closeSubTask() : (this.isSubTaskMode = true);
    }
  };

  public closeSubTask = () => {
    this.closing = true;

    setTimeout(() => {
      this.isSubTaskMode = false;
      this.closing = false;
    }, 450);
  };

  protected subTaskButtonText: string = 'Add';
  public changeSubTaskText = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.subTaskButtonText = inputElement.value != '' ? 'Save' : 'Add';
  };

  public setSubTasks = (value: string) => {
    this.subTaskList?.push(value);
    this.addTaskConfig.setValueOnChange(this.subTaskList, 'subTask');
    this.subTaksInput = '';
  };

  public deleteSubTask = (index: number) => {
    this.subTaskList.splice(index, 1);
  };

  /* END */

  /* CLOSE ADD TASK */

  public closeAddTask = () => {
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
      const taskId = await this.task.insertTask(
        this.userId!,
        this.userInput.value
      );

      if (taskId) {
        this.closeAddTask();
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

  @Input() taskData: any;

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

  /* CONFIRMATION MODAL */

  public isConfirmModalOpen: boolean | null = null;
  public confirm = confirm;
  /* OPEN THE MODAL AND RECIEVE THE USER RESPONSE */
  public openConfirmationModal = async (subTaskIndex: number) => {
    this.popModal.setConfirmaModalStatus(true);

    const response = await this.getUserConfirmResponse();

    if (response) {
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
