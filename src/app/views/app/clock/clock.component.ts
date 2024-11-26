import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { catchError, EMPTY, of, Subject } from 'rxjs';
import { TimerClass } from './class/timer';
import { TimerObervableService } from '../../../service/timer-obervable.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResponseService } from '../../../service/reponse.service';
import { pomoPalBtn, timerType } from '../../../interfaces/pomoPal';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss',
})
export class ClockComponent implements OnInit, OnDestroy {
  constructor(
    protected timer$: TimerObervableService,
    protected response: ResponseService
  ) {
    this.timer = new TimerClass(timer$);
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

  public btnStatus: number = 0;
  public setButtonStatus = (value: number) => {
    this.btnStatus = value;

    // SHOW DEFAULT TIMER PER STATUS (BREAK OR WORK)
    this.setDefaultTimerText(value);
  };

  public setDefaultTimerText = (pomoStatus: number) => {
    if (pomoStatus === pomoPalBtn.Pomodoro) {
      this.defaultCountDown = 1500;
    } else if (pomoStatus === pomoPalBtn.ShortBreak) {
      this.defaultCountDown = 300;
    } else {
      this.defaultCountDown = 900;
    }
  };

  /* RUN POMODORO */
  /* isTimerRunning for UI */
  /* isPause for setting the remaining time in resume */
  public isTimerRunning: boolean = false;
  public isPause: boolean = false;
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
          this.isTimerRunning = false;
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

  ngOnDestroy(): void {
    this.timer.intervalTimeOut$.next(true);

    console.log('destroyed');
  }
}
