import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { catchError, EMPTY, of, Subject } from 'rxjs';
import { TimerClass } from './class/timer';
import { TimerObervableService } from '../../../service/timer-obervable.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResponseService } from '../../../service/reponse.service';
import { pomoPalBtn, timerType } from '../../../interfaces/pomoPal';
import { Alarm, AlarmHandler } from './class/alarm';

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
    protected renderer: Renderer2
  ) {
    this.timer = new TimerClass(timer$);
    this.alarm = new Alarm(el, renderer);
    this.alarmHandler = new AlarmHandler();
  }

  ngOnInit(): void {
    /* FETCH TIMER COUNT DOWN */
    this.fetchCountDownDisplay();
  }

  public destroyRef = inject(DestroyRef);
  public destroySubs$: Subject<boolean> = new Subject<boolean>();
  public appHeaderText: string = 'PomoPal';
  public timer: TimerClass;
  public alarm: Alarm;
  public alarmHandler: AlarmHandler;

  public btnStatus: number = 0;
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
  public currentMode: 'work' | 'break' = 'work';
  public isAlarmTriggered: boolean = false;

  /* RUN THE TIMER */
  public runTimer = (timer: number) => {
    this.isTimerRunning = true;
    this.timer.setConfig(timer);
  };

  public pauseTimer = () => {
    this.isPause = true;
    this.isTimerRunning = false;
    this.timer.pauseTimer();
  };

  /* GET COUNT DOWN */
  public defaultCountDown: number = 3;
  public displayCountDown: string = '0';
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

  public breakTime = () => {
    /* RESET COUNTDOWN TO USE THE DEFAULT*/
    this.timer$.setCountDownDisplay('0');
    // INCREMENT POMODORO EVERY 25MINS OR END WOKRING TIME
    this.runPomodoro = this.timer.incrementPomodoro();

    /* CHECK IF THE USER  RUN POMODORO (25MINS) EVERY 3 TIMES*/
    if (this.runPomodoro % 3 === 0) {
      this.setButtonStatus(pomoPalBtn.LongBreak);
    } else {
      this.setButtonStatus(pomoPalBtn.ShortBreak);
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

  ngOnDestroy(): void {
    this.timer.intervalTimeOut$.next(true);
  }
}
