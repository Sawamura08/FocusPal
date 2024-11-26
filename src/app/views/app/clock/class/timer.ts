import { interval, startWith, Subject, takeUntil, timer } from 'rxjs';
import { TimerObervableService } from '../../../../service/timer-obervable.service';

export class TimerClass {
  constructor(protected timer$: TimerObervableService) {}

  public intervalTimeOut$ = new Subject<boolean>();
  /* SET CONFIG BEFORE RUNNING TIMER */
  /* THE SET TIMER IS ALWAYS AT SECONDS VALUE */
  public setConfig = (setTimer: number) => {
    let timeDurationMilliseconds: number;

    const seconds = setTimer;
    timeDurationMilliseconds = seconds * 1000;

    this.setTimer(timeDurationMilliseconds);
  };

  /* TIMER */
  public setTimer = (duration: number) => {
    const timeInterval = timer(1, 1000);
    let formattedTime: any;
    const endTime = Date.now() + duration;

    timeInterval.pipe(takeUntil(this.intervalTimeOut$)).subscribe((val) => {
      const currentTime = Date.now();
      if (currentTime < endTime) {
        formattedTime = this.convertToSeconds(endTime - currentTime);
        this.timer$.setCountDownDisplay(formattedTime);
      } else {
        this.timer$.setCountDownDisplay('Times Up');
        this.intervalTimeOut$.next(true);
        this.intervalTimeOut$.complete();
      }
    });
  };

  public convertToSeconds = (durationMilliseconds: number) => {
    const millisecond = 1000;
    const seconds = durationMilliseconds / millisecond;

    return this.getFormattedTime(seconds);
  };

  public getFormattedTime = (timeInSeconds: number) => {
    const secondsInAMinute = 60;
    const minutes = Math.floor(timeInSeconds / secondsInAMinute);

    const seconds = Math.floor(timeInSeconds % secondsInAMinute);

    // FORMATS SECONDS SO IT HAS 0 IF IT'S LESS THAN 10 == 09 instead of 9 only
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    const formattedTime = `${minutes}:${formattedSeconds}`;

    return formattedTime;
  };
  /* END */

  /* PAUSE TIMER */

  public pauseTimer = () => {
    this.intervalTimeOut$.next(true);
  };

  /* CONVERT FORMATTED TIME TO SECONDS */
  public reverseFormattedTime = (formattedTime: string) => {
    const splitTime = formattedTime.split(':');

    /* GET MINUTES */
    const minutes = parseInt(splitTime[0]);
    const convertedToSeconds = Math.floor(minutes * 60);

    /* GET SECONDS */
    const seconds = parseInt(splitTime[1]);

    /* converted */
    const converted = convertedToSeconds + seconds;

    return converted;
  };
}
