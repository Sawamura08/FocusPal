import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { catchError, EMPTY, filter, map, of, Subject, take } from 'rxjs';
import { TimerClass } from './class/timer';
import { TimerObervableService } from '../../../service/timer-obervable.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResponseService } from '../../../service/reponse.service';
import { pomoPalBtn, pomoTask, timerType } from '../../../interfaces/pomoPal';
import { Alarm, AlarmHandler } from './class/alarm';
import { PomoTaskObservableService } from './service/pomo-task-observable.service';
import { modalStatus } from '../../../Objects/modal.details';
import { PomoTask } from './class/pomoTask';
import { ToastrService } from 'ngx-toastr';
import { PomodoroTaskService } from '../../../database/pomodoro-task.service';
import { SessionService } from '../../../service/session.service';
import { ToastModalService } from '../../../service/toast-modal.service';
import { ModalType, PopModalService } from '../../../service/pop-modal.service';
import { GamifiedCompletionService } from '../../../components/gamified-completion-modal/service/gamified-completion.service';
import { GameUserDataService } from '../../../database/game-user-data.service';
import { userGameData } from '../../../interfaces/game.interface';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss',
})
export class ClockComponent implements OnInit, OnDestroy {
  constructor(
    protected timer$: TimerObervableService,
    protected response: ResponseService,
    protected el: ElementRef,
    protected renderer: Renderer2,
    protected pomoTask$: PomoTaskObservableService,
    protected pomoTask: PomodoroTaskService,
    protected session: SessionService,
    protected toastr: ToastrService,
    protected toastNotif: ToastModalService,
    protected popModal: PopModalService,
    protected game$: GamifiedCompletionService,
    protected gameData: GameUserDataService
  ) {
    this.timer = new TimerClass(timer$, pomoTask);
    this.alarm = new Alarm(el, renderer);
    this.alarmHandler = new AlarmHandler();
  }

  ngOnInit(): void {
    /* FETCH TIMER COUNT DOWN */
    this.fetchCountDownDisplay();

    /* FETCH UNCOMPLETED TASK */
    this.fetchTask();

    /* FETCH MODAL INFO OBSERVABLE */
    this.modalInfoObservable();

    /* FETCH SESSION */
    this.getSession();
  }

  public destroyRef = inject(DestroyRef);
  public destroySubs$: Subject<boolean> = new Subject<boolean>();
  public appHeaderText: string = 'PomoPal';
  public timer: TimerClass;
  public alarm: Alarm;
  public alarmHandler: AlarmHandler;
  public taskList: pomoTask[] = [];
  public btnStatus: number = 0;
  public userId: number | undefined;

  /* GET SESSION */
  public getSession = () => {
    this.session
      .getUser()
      .pipe(
        filter((value) => value != undefined),
        catchError((err) => {
          console.error(this.response.errorResponse(), err);
          return of(undefined);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.userId = value?.userId;
      });
  };

  public setButtonStatus = (value: number) => {
    this.btnStatus = value;

    // SHOW DEFAULT TIMER PER STATUS (BREAK OR WORK)
    this.setDefaultTimerText(value);
  };

  public setDefaultTimerText = (pomoStatus: number) => {
    if (pomoStatus === pomoPalBtn.Pomodoro) {
      this.defaultCountDown = 3;
    } else if (pomoStatus === pomoPalBtn.ShortBreak) {
      this.defaultCountDown = 3;
    } else {
      this.defaultCountDown = 3;
    }
  };

  /* RUN POMODORO */
  /* isTimerRunning for UI */
  /* isPause for setting the remaining time in resume */
  public isTimerRunning: boolean = false;
  public isPause: boolean = false;
  public pomoPalStatus = pomoPalBtn;
  public runPomodoro: number = 0;
  public updatedTaskData: pomoTask | undefined = undefined;
  public currentMode: 'work' | 'break' = 'work';
  public isAlarmTriggered: boolean = false;
  public noTaskMessage = {
    imgPath: '/extra/info.png',
    title: 'No Task Selected',
    text: 'Please select a task before starting the timer..',
  };
  public sendNoTaskMessage: ModalType = ModalType.NONE;

  /* RUN THE TIMER OR START TASK*/
  public runTimer = (timer: number) => {
    if (this.taskCurrentlyWorking != undefined) {
      this.isTimerRunning = true;
      this.timer.setConfig(timer);
    } else {
      //SET AS INCORRECT SINCE THE USER START THE TIMER WITHOUT SELECTED TASK!
      this.popModal.openModal(ModalType.INCORRECT);
    }
  };

  public pauseTimer = () => {
    this.isPause = true;
    this.isTimerRunning = false;
    this.timer.pauseTimer();
  };

  /* GET COUNT DOWN */
  public defaultCountDown: number = 3;
  public displayCountDown: string = '0';

  /* Remaining Time for when pause */
  public remainingCountDown: number = 0;
  public fetchCountDownDisplay = () => {
    this.timer$
      .getcountDownDisplay()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          const error = this.response.errorResponse();
          console.log(error.message, err);
          return EMPTY;
        })
      )
      .subscribe((value) => {
        this.displayCountDown = value;

        if (value === 'Times Up') {
          this.configureUITimeBoard();
          this.timer.intervalTimeOut$.next(true);
        }
      });
  };

  /* RESUME */
  public setRemainingTime = (time: string) => {
    const remainingTime = this.timer.reverseFormattedTime(time);
    this.remainingCountDown = remainingTime;

    /* RESUME TIME */
    this.isPause = false;
    this.isTimerRunning = true;
    this.timer.setConfig(remainingTime);
  };

  public stopAlarm = (id: string) => {
    this.alarm.stopAlarm(id);

    this.alarmHandler.interrupt();
    this.performNewMode();
  };

  /* CONFIGURATION OF UI TIME BOARD THEN THE TIME RUNS OUT */
  /* TRIGGERED AFTER WORK TIME END */
  public configureUITimeBoard = () => {
    this.isTimerRunning = false;
    this.isAlarmTriggered = true;
    this.alarm.autoPlay('alarm');

    this.isInterrupted = true; // interrupt the setTimeout to stop alarm immediately
    /* CHECK IF THE TIME IS ON BREAK OR NOT */
    this.setNewMode();
  };

  public breakTime = async () => {
    /* RESET COUNTDOWN TO USE THE DEFAULT*/
    this.timer$.setCountDownDisplay('0');
    // INCREMENT POMODORO EVERY 25MINS OR END WOKRING TIME
    this.updatedTaskData = await this.timer.incrementPomodoro(
      this.taskCurrentlyWorking!
    );
    this.runPomodoro = this.updatedTaskData?.pomodoroCompleted!; // updated completed pomodoro

    /* CHECK FIRST THE COUNT OF TASK POMODORO */
    if (
      this.taskCurrentlyWorking &&
      this.runPomodoro < this.taskCurrentlyWorking.pomodoro
    ) {
      /* CHECK IF THE USER  RUN POMODORO (25MINS) EVERY 3 TIMES*/
      if (this.runPomodoro % 3 === 0) {
        this.setButtonStatus(pomoPalBtn.LongBreak);
      } else {
        this.setButtonStatus(pomoPalBtn.ShortBreak);
      }
    } else {
      /* FETCH DATA THEN OPEN THE COMPLETION MODAL */
      this.fetchGameUserData();
    }
  };

  /* CONFIGURATION OF UI TIME BOARD THEN THE TIME RUNS OUT */
  /* TRIGGERED AFTER BREAK TIME END */
  public workTime = () => {
    /* RESET COUNTDOWN TO USE THE DEFAULT*/
    this.timer$.setCountDownDisplay('0');

    this.setButtonStatus(pomoPalBtn.Pomodoro);
  };

  /* SET NEW MODE WORK OR BREAK */
  public isInterrupted: boolean = false;
  public setNewMode = () => {
    /* SET CURRENT STATUS */
    this.currentMode = this.currentMode === 'work' ? 'break' : 'work';

    /* STOP ALARM BUTTON WILL DISAPPEAR AFTER 5 SECONDS */
    const waitDuration: number = 5000;
    this.alarmHandler.waitWidthInterruption(waitDuration).then(() => {
      this.performNewMode();
    });
  };

  /* TRIGGER THE NEW MODE */
  public performNewMode = () => {
    if (this.currentMode === 'work') {
      this.workTime();
    } else {
      this.breakTime();
    }

    this.isAlarmTriggered = false;
  };

  /* FETCH GAME USER DATA */
  public fetchGameUserData = async () => {
    if (this.userId != undefined) {
      const result = await this.gameData.fetchUserByID(this.userId);

      this.triggerCompletionModal(result.value);
    }
  };

  /* CONGRATULATORY MODAL*/
  public triggerCompletionModal = (data: userGameData) => {
    if (data != undefined) {
      this.game$.setCompletionModalValue(data);
      this.game$.setCompletionModalStatus(modalStatus.open);

      // THE TAKS IS NOW COMPLETE
      this.setPomoTaskAsCompleted(this.taskCurrentlyWorking!);
    }
  };

  public setPomoTaskAsCompleted = async (pomoTask: pomoTask) => {
    if (pomoTask && pomoTask.taskId != undefined) {
      let copyTask = structuredClone(pomoTask);
      copyTask.status = true;
      await this.pomoTask.updateTask(copyTask.taskId!, copyTask);

      this.taskCurrentlyWorking = undefined;
    }
  };

  /* -------------------------- TASK FEATURE -------------------------- */

  public getModalStatus = () => {
    return this.pomoTask$.getPomodoroModalStatus()();
  };

  public openTaskModal = () => {
    this.pomoTask$.setPomodoroModalStatus(modalStatus.open);
  };

  public fetchTask = () => {
    this.pomoTask.taskList$
      .pipe(
        catchError((err) => {
          const error = this.response.errorResponse();
          console.error(error, err);
          return of([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => (this.taskList = value));
  };

  public taskIndexSelected: number | undefined;
  public taskCurrentlyWorking: pomoTask | undefined;
  public selectTaskToWork = (index: number, taskData: pomoTask) => {
    this.taskIndexSelected = index;

    this.taskCurrentlyWorking = taskData;
    this.timer.setUpTaskData(taskData);
  };

  public editTask = (taskData: pomoTask) => {
    this.pomoTask$.setPomodoroModalValue(taskData);
    this.pomoTask$.setPomodoroModalStatus(modalStatus.open);
  };

  /* END */

  /* OBSERVABLES */

  public modalInfoObservable = () => {
    this.popModal
      .getModalStatus()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error(this.response.errorResponse());
          return of(ModalType.NONE);
        })
      )
      .subscribe((value) => (this.sendNoTaskMessage = value));
  };

  ngOnDestroy(): void {
    this.timer.intervalTimeOut$.next(true);
  }
}