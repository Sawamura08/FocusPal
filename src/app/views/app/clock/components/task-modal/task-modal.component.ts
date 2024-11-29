import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pomoTask } from '../../../../../interfaces/pomoPal';
import { PomoTask } from '../../class/pomoTask';
import { ToastrService } from 'ngx-toastr';
import { PomodoroTaskService } from '../../../../../database/pomodoro-task.service';
import { ResponseService } from '../../../../../service/reponse.service';
import { SessionService } from '../../../../../service/session.service';
import { ToastModalService } from '../../../../../service/toast-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PomoTaskObservableService } from '../../service/pomo-task-observable.service';
import { modalStatus } from '../../../../../Objects/modal.details';

import { slideUp } from '../../../../../animation/slide-up.animate';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
  animations: [slideUp],
})
export class TaskModalComponent implements OnInit {
  constructor(
    protected fb: FormBuilder,
    protected pomoTask: PomodoroTaskService,
    protected response: ResponseService,
    protected session: SessionService,
    protected toastr: ToastrService,
    protected toastNotif: ToastModalService,
    protected pomoTask$: PomoTaskObservableService
  ) {
    this.userInput = this.fb.group({
      title: ['', Validators.required],
      pomodoro: ['', Validators.required],
      description: ['', Validators.required],
      status: [0, Validators.required],
      userId: ['', Validators.required],
    });

    this.pomoTaskClass = new PomoTask(
      pomoTask,
      response,
      session,
      toastr,
      toastNotif
    );
  }

  ngOnInit(): void {
    /* FETCH SESSION */
    this.getSession();

    /* SET UP UPDATE  */
    this.setUpUpdate();
  }

  /* GLOBAL DECLARATION */
  public pomoTaskClass: PomoTask;
  public userId: number | undefined;
  public destroyRef = inject(DestroyRef);
  public animateModal: boolean = true;

  public getSession = () => {
    this.pomoTaskClass
      .fetchSessionID()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.userId = value));
  };

  /* FORMS */
  public userInput: FormGroup;

  /* GETTERS */
  get title() {
    return this.userInput.get('title');
  }

  get pomodoro() {
    return this.userInput.get('pomodoro');
  }

  get description() {
    return this.userInput.get('description');
  }

  public errorCheck = (fieldName: string) => {
    const field = this.userInput.get(fieldName);

    if ((field?.dirty || field?.touched) && field.invalid) {
      return false;
    }

    return true;
  };
  /* END */

  /* NUMBER INPUT CONTROLLER */
  public currentPomodoroValue: number = 0;
  public numberInputController = (controller: 'up' | 'down') => {
    const field = this.userInput.get('pomodoro');

    if (controller === 'up' && this.currentPomodoroValue < 10) {
      this.currentPomodoroValue++;
    } else if (controller === 'down' && this.currentPomodoroValue > 0) {
      this.currentPomodoroValue--;
    }

    field?.setValue(this.currentPomodoroValue);
  };

  /* SUBMIT  */
  public submit = () => {
    this.patchUserId();
    this.userInput.markAllAsTouched();

    if (this.userInput.valid) {
      this.pomoTaskClass.insertNewTask(this.userInput.value);
      this.closeModal();
    }
  };

  /* SET THE USERID INTO USERINPUT BEFORE SUBMIT */
  public patchUserId = () => {
    const id = this.userInput.get('userId');

    id?.setValue(this.userId);
  };

  public isInfoDisplayed: boolean = false;
  public toggleInfo = () => {
    this.isInfoDisplayed = !this.isInfoDisplayed;
  };

  /* CLOSE TASK MODAL */

  public closeModal = () => {
    this.animateModal = false;
    // REMOVE SIGNAL DATA TO RESET USER INPUT
    this.pomoTask$.setPomodoroModalValue(undefined);

    setTimeout(() => {
      this.pomoTask$.setPomodoroModalStatus(modalStatus.close);
    }, 300);
  };

  /* --------------- UPDATE SECTION ------------ */
  public updateMode: boolean = false;
  public taskUpdateData: pomoTask | undefined;
  public setUpUpdate = () => {
    this.taskUpdateData = this.pomoTask$.getPomodoroModalValue()();

    if (this.taskUpdateData != undefined) {
      this.userInput.patchValue(this.taskUpdateData);
      this.updateMode = true;
    }
  };

  public updateTask = () => {
    this.userInput.markAllAsTouched();

    if (
      this.userInput.valid &&
      this.taskUpdateData != undefined &&
      this.taskUpdateData.taskId != undefined
    ) {
      this.pomoTaskClass.updateTask(
        this.taskUpdateData.taskId,
        this.userInput.value
      );
      this.closeModal();
    }
  };

  public deleteTask = () => {
    if (
      this.taskUpdateData != undefined &&
      this.taskUpdateData.taskId != undefined
    ) {
      this.pomoTaskClass.deleteTask(this.taskUpdateData.taskId);
      this.closeModal();
    }
  };
}
