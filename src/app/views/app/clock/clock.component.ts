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
import { Alarm } from './class/alarm';

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
  }

  ngOnInit(): void {
    /* FETCH TIMER COUNT DOWN */
    this.fetchCountDownDisplay();
  }

  public destroyRef = inject(DestroyRef);
  public destroySubs$: Subject<boolean> = new Subject<boolean>();
  public appHeaderText: string = 'PomoPal';
  public pomoPalBtn: string[] = ['Pomodoro', 'Short Break', 'Long Break'];
  public timer: TimerClass;
  public alarm: Alarm;

  public btnStatus: number = 0;
  public setButtonStatus = (value: number) => {
    this.btnStatus = value;

    // SHOW DEFAULT TIMER PER STATUS (BREAK OR WORK)
    this.setDefaultTimerText(value);
  };

  public setDefaultTimerText = (pomoStatus: number) => {
    if (pomoStatus === pomoPalBtn.Pomodoro) {
      this.defaultCountDown = 5;
    } else if (pomoStatus === pomoPalBtn.ShortBreak) {
      this.defaultCountDown = 5;
    } else {
      this.defaultCountDown = 5;
    }
  };

  /* RUN POMODORO */
  /* isTimerRunning for UI */
  /* isPause for setting the remaining time in resume */
  public isTimerRunning: boolean = false;
  public isPause: boolean = false;
  public isAlarmRunning: boolean = false;
  public isOnBreak: boolean = false;
  public runPomodoro: number = 0;
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
  public defaultCountDown: number = 1500;
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
    this.isAlarmRunning = false;
    this.alarm.stopAlarm(id);
    this.breakTime();
  };

  /* CONFIGURATION OF UI TIME BOARD THEN THE TIME RUNS OUT */
  /* TRIGGERED AFTER WORK TIME END */
  public configureUITimeBoard = () => {
    this.isTimerRunning = false;
    this.isAlarmRunning = true;
    this.alarm.autoPlay('alarm');

    /* CHECK IF THE TIME IS ON BREAK OR NOT */

    /* STOP ALARM BUTTON WILL DISAPPEAR AFTER 5 SECONDS */
    setTimeout(() => {
      this.isAlarmRunning = false;

      if (!this.isOnBreak) {
        this.breakTime();
      } else {
        this.workTime();
      }
    }, 5000);
  };

  public breakTime = () => {
    this.timer$.setCountDownDisplay('0');
    // INCREMENT POMODORO EVERY 25MINS OR END WOKRING TIME
    this.runPomodoro = this.timer.incrementPomodoro();

    /* SET STATUS ON BREAK */
    this.isOnBreak = true;

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
    /* SET STATUS TO WORK TIME */
    this.isOnBreak = false;
    this.setButtonStatus(pomoPalBtn.Pomodoro);
  };

  ngOnDestroy(): void {
    this.timer.intervalTimeOut$.next(true);

    console.log('destroyed');
  }
}
